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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
}