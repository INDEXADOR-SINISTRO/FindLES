package com.example.findles.service;

import com.example.findles.domain.Categoria;
import com.example.findles.domain.Documento;
import com.example.findles.repository.CategoriaRepository;
import com.example.findles.repository.DocumentoRepository;
import com.example.findles.repository.StatusDocumentoRepository;
import com.example.findles.domain.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

import com.example.findles.dto.DadosListagemDocumentoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class DocumentoService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentoService.class);

    @Autowired
    private DocumentoRepository repository;

    // NOVO: Repositório para fazer a ligação com a Categoria
    @Autowired
    private CategoriaRepository categoriaRepository;

    // NOVO: Repositório para o Status (já explico abaixo)
    @Autowired
    private StatusDocumentoRepository statusRepository;

    private final String DIRETORIO_UPLOADS = "uploads/documentos/";

    @Transactional
    public void salvarDocumentos(List<MultipartFile> arquivos, Integer idCategoria, Usuario usuarioLogado) {

        try {
            Files.createDirectories(Paths.get(DIRETORIO_UPLOADS));
        } catch (IOException e) {
            throw new RuntimeException("Erro ao criar diretório de uploads", e);
        }

        // 1. Resolvemos a Categoria ANTES do loop (para não repetir processamento)
        Categoria categoriaSelecionada = null;
        if (idCategoria != null) {
            // getReferenceById cria apenas a referência para a Foreign Key sem fazer um SELECT no banco
            categoriaSelecionada = categoriaRepository.getReferenceById(idCategoria);
        }

        // 2. Resolvemos o Status Inicial (ID 1 = Pendente, por exemplo)
        // Como no seu banco de dados a coluna ID_STATUS_DOC é NOT NULL, precisamos preencher!
        var statusInicial = statusRepository.getReferenceById(1);

        for (MultipartFile arquivo : arquivos) {
            if (arquivo.isEmpty()) continue;

            if (!"application/pdf".equals(arquivo.getContentType())) {
                throw new IllegalArgumentException("Formato inválido. O sistema aceita apenas arquivos PDF.");
            }

            try {
                String nomeOriginal = arquivo.getOriginalFilename();
                String nomeUnico = UUID.randomUUID() + "_" + nomeOriginal;
                Path caminhoFisico = Paths.get(DIRETORIO_UPLOADS + nomeUnico);

                Files.copy(arquivo.getInputStream(), caminhoFisico, StandardCopyOption.REPLACE_EXISTING);

                String hashConteudo = calcularHash(arquivo.getBytes());

                Documento doc = new Documento();
                doc.setTitulo(nomeOriginal.substring(0, Math.min(nomeOriginal.length(), 50)));
                doc.setCaminhoArquivo(caminhoFisico.toString());
                doc.setHashConteudo(hashConteudo);
                doc.setNumeroVersao("1.0");
                doc.setCriadoEm(LocalDateTime.now());
                doc.setAtualizadoEm(LocalDateTime.now());
                doc.setInseridoPor(usuarioLogado);

                // Setando as chaves estrangeiras que acabamos de preparar
                doc.setCategoria(categoriaSelecionada); // Pode ser a referência ou null
                doc.setStatusDoc(statusInicial);        // Obrigatório (NOT NULL no seu BD)

                repository.save(doc);

            } catch (Exception e) {
                throw new RuntimeException("Falha ao salvar o arquivo: " + arquivo.getOriginalFilename(), e);
            }

        }
        logger.info("Arquivos cadastrados com sucesso");
    }

    private String calcularHash(byte[] bytesArquivo) throws NoSuchAlgorithmException {
        // ... (Mesmo código do hash, mantido intacto)
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedhash = digest.digest(bytesArquivo);
        StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
        for (int i = 0; i < encodedhash.length; i++) {
            String hex = Integer.toHexString(0xff & encodedhash[i]);
            if(hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public Page<DadosListagemDocumentoDTO> listar(String titulo, Integer idCategoria, LocalDate dataDe, LocalDate dataAte, Pageable paginacao) {

        // Converte as datas para pegar o início do dia e o final do dia
        LocalDateTime dataDeConvertida = (dataDe != null) ? dataDe.atStartOfDay() : null;
        LocalDateTime dataAteConvertida = (dataAte != null) ? dataAte.atTime(LocalTime.MAX) : null;

        // O repositório faz todo o trabalho pesado de ignorar o que for null
        Page<Documento> documentosPaginados = repository.buscarComFiltrosDinamicos(
                titulo,
                idCategoria,
                dataDeConvertida,
                dataAteConvertida,
                paginacao
        );

        return documentosPaginados.map(DadosListagemDocumentoDTO::new);
    }

    public Resource carregarArquivoComoRecurso(Integer id) {
        // 1. Busca no banco de dados
        Documento doc = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado com o ID: " + id));

        try {
            // 2. Pega o caminho físico salvo no banco (ex: "uploads/documentos/arquivo.pdf")
            Path caminhoArquivo = Paths.get(doc.getCaminhoArquivo()).normalize();

            // 3. Transforma o arquivo em um Recurso do Spring
            Resource recurso = new UrlResource(caminhoArquivo.toUri());

            // 4. Verifica se o arquivo realmente existe na pasta e pode ser lido
            if (recurso.exists() && recurso.isReadable()) {
                return recurso;
            } else {
                throw new RuntimeException("Arquivo não encontrado ou corrompido no servidor.");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erro ao processar o caminho do arquivo.", e);
        }
    }
}