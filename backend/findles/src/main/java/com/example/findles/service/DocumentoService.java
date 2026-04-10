package com.example.findles.service;

import com.example.findles.domain.entity.*;
import com.example.findles.repository.*;
import jakarta.persistence.EntityNotFoundException;
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
import java.util.*;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.example.findles.domain.dto.response.DadosListagemDocumentoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class DocumentoService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentoService.class);

    @Autowired
    private DocumentoRepository repository;

    @Autowired
    private TermoRepository termoRepository;

    // NOVO: Repositório para fazer a ligação com a Categoria
    @Autowired
    private CategoriaRepository categoriaRepository;

    // NOVO: Repositório para o Status (já explico abaixo)
    @Autowired
    private StatusDocumentoRepository statusRepository;

    @Autowired
    private ExtratorTextoService extratorService;

    @Autowired
    private ProcessadorTextoService processadorTextoService;

    @Autowired
    private IndiceInvertidoRepository indiceInvertidoRepository;


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
            categoriaSelecionada = categoriaRepository.getReferenceById(idCategoria);
        }

        // 2. Resolvemos o Status Inicial (ID 3 = Pendente)
        var statusInicial = statusRepository.getReferenceById(3);

        for (MultipartFile arquivo : arquivos) {
            if (arquivo.isEmpty()) continue;

            if (!"application/pdf".equals(arquivo.getContentType())) {
                throw new IllegalArgumentException("Formato inválido. O sistema aceita apenas arquivos PDF.");
            }

            try {
                String nomeOriginal = arquivo.getOriginalFilename();

                // 3. Calcula o hash ANTES de salvar no disco físico
                String hashConteudo = calcularHash(arquivo.getBytes());

                // 4. A NOVA VALIDAÇÃO: Consulta o banco de dados
                if (repository.existsByHashConteudoAtivoOuPendente(hashConteudo)) {
                    throw new IllegalArgumentException("O arquivo '" + nomeOriginal + "' já foi inserido anteriormente no sistema (conteúdo duplicado).");
                }

                // 5. Como o arquivo passou na validação, agora sim gravamos no HD do servidor
                String nomeUnico = UUID.randomUUID() + "_" + nomeOriginal;
                Path caminhoFisico = Paths.get(DIRETORIO_UPLOADS + nomeUnico);

                Files.copy(arquivo.getInputStream(), caminhoFisico, StandardCopyOption.REPLACE_EXISTING);

                // 6. Monta a entidade e salva no banco
                Documento doc = new Documento();
                doc.setTitulo(nomeOriginal.substring(0, Math.min(nomeOriginal.length(), 50)));
                doc.setCaminhoArquivo(caminhoFisico.toString());
                doc.setHashConteudo(hashConteudo);
                doc.setNumeroVersao("1.0");
                doc.setCriadoEm(LocalDateTime.now());
                doc.setAtualizadoEm(LocalDateTime.now());
                doc.setInseridoPor(usuarioLogado);

                doc.setCategoria(categoriaSelecionada);
                doc.setStatusDoc(statusInicial);

                repository.save(doc);

            } catch (IllegalArgumentException e) {
                // Captura a NOSSA exceção de validação e joga para cima (para o Controller enviar o erro 400 ao front)
                throw e;
            } catch (Exception e) {
                // Captura erros genéricos (ex: HD cheio, banco fora do ar)
                throw new RuntimeException("Falha ao salvar o arquivo: " + arquivo.getOriginalFilename(), e);
            }
        }

        // Aqui vale usar o logger do Slf4j ou similar
        // logger.info("Arquivos cadastrados com sucesso");
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

    @Transactional
    public int indexarDocumentosPendentes() {
        // 1. Busca todos os documentos com status PENDENTE (ID 3)
        List<Documento> documentosPendentes = repository.findByStatusDocId(3);

        // Se a lista vier vazia, já encerramos por aqui
        if (documentosPendentes.isEmpty()) {
            return 0;
        }

        // 2. Busca o status ATIVO (ID 1) apenas uma vez para economizar idas ao banco
        StatusDocumento statusAtivo = statusRepository.findById(1)
                .orElseThrow(() -> new IllegalStateException("Status ATIVO não configurado no banco."));

        int indexadosComSucesso = 0;

        // 3. Inicia a fila de processamento
        for (Documento documento : documentosPendentes) {
            try {
                logger.info("Iniciando extração do documento ID: {}", documento.getId());

                // 1. Extração e Processamento
                String textoCru = extratorService.extrairTextoDoPdf(documento.getCaminhoArquivo());
                String textoProcessado = processadorTextoService.processar(textoCru);

                // 2. A MÁGICA DA FREQUÊNCIA: Transforma o texto em um Mapa (Ex: "capacitaca" -> 5)
                Map<String, Long> mapaFrequencia = Arrays.stream(textoProcessado.split(" "))
                        .filter(token -> !token.trim().isEmpty())
                        .collect(Collectors.groupingBy(
                                Function.identity(), // A própria palavra é a chave
                                Collectors.counting() // Conta as repetições
                        ));

                // NOVIDADE AQUI: 2.5 Calcula o total geral de termos do documento
                // Soma todas as frequências para obter o tamanho real do documento processado
                int totalDeTermos = mapaFrequencia.values().stream()
                        .mapToInt(Long::intValue)
                        .sum();

                // Atribui o total ao documento
                documento.setTotalTermos(totalDeTermos);

                // 3. Limpa índices antigos (caso o documento esteja sendo reindexado)
                documento.getIndices().clear();

                // 4. Salva os Termos e cria os Índices Invertidos com a Frequência
                for (Map.Entry<String, Long> entrada : mapaFrequencia.entrySet()) {
                    String valorToken = entrada.getKey();
                    Integer frequencia = entrada.getValue().intValue();

                    // Busca o termo ou cria um novo
                    Termo termo = termoRepository.findByTermoNormalizado(valorToken)
                            .orElseGet(() -> termoRepository.save(new Termo(valorToken)));

                    // Adiciona a relação já com a frequência matemática salva!
                    documento.adicionarIndice(termo, frequencia);
                }

                // 5. Salva no banco
                documento.setTextoCru(textoCru);
                documento.setStatusDoc(statusAtivo);

                // Graças ao CascadeType.ALL, ao salvar o documento, o Spring salva os itens na INDICE_INVERTIDO
                repository.save(documento);
                indexadosComSucesso++;
                logger.info("Documento ID: {} indexado com sucesso! Total de termos: {}", documento.getId(), totalDeTermos);

            } catch (Exception e) {
                // Se der erro em UM arquivo, logamos o erro, mas o laço FOR continua para o próximo!
                logger.error("Falha ao indexar documento ID {}: {}", documento.getId(), e.getMessage());
            }
        }

        return indexadosComSucesso;
    }

    @Transactional
    public void calcularTfIdfDeTodaABase() {
        try {


            logger.info("Iniciando cálculo de TF-IDF para toda a base...");

            // 1. Total de documentos ativos (N)
            long totalDocumentosAtivos = repository.countByStatusDocId(1);

            if (totalDocumentosAtivos == 0) {
                logger.warn("Nenhum documento ativo encontrado para calcular TF-IDF.");
                throw new IllegalArgumentException("Nenhum documento ativo encontrado para calcular TF-IDF.");
            }

            // 2. Busca todos os termos existentes no banco
            // Nota: Em uma base com milhões de termos, isso precisaria ser paginado (Pageable).
            List<Termo> todosTermos = termoRepository.findAll();

            for (Termo termo : todosTermos) {
                // 3. Document Frequency (DF): Em quantos documentos este termo aparece?
                List<IndiceInvertido> indicesDoTermo = indiceInvertidoRepository.findByTermo(termo);
                int df = indicesDoTermo.size();

                // Se o termo não está em nenhum documento (talvez um doc tenha sido deletado), pula
                if (df == 0) continue;

                // 4. Calcula o IDF do termo usando Logaritmo na base 10
                double idf = Math.log10((double) totalDocumentosAtivos / df );

                // 5. Calcula o TF e o TF-IDF para cada documento que possui o termo
                for (IndiceInvertido indice : indicesDoTermo) {
                    Documento documento = indice.getDocumento();

                    int tfBruto = indice.getFrequencia();
                    int totalTermosNoDoc = documento.getTotalTermos();

                    // Evita divisão por zero caso haja alguma inconsistência no banco
                    if (totalTermosNoDoc == 0) continue;

                    // Calcula o TF (Proporção da palavra dentro do texto)
                    double tf = (double) tfBruto / totalTermosNoDoc;

                    // Calcula o Peso Final e salva na entidade
                    double pesoTfIdf = tf * idf;
                    indice.setTfIdf(pesoTfIdf);
                }

                // 6. Salva as atualizações no banco em lote para este termo
                indiceInvertidoRepository.saveAll(indicesDoTermo);
            }

            logger.info("Cálculo de TF-IDF concluído com sucesso!");
        }catch(Exception e){
            logger.error("Falha ao calcular peso TF-IDF: {}", e.getMessage());
            throw e;
        }
    }


    public void removerLogicamente(Integer id){
        try{
            logger.info("Removendo lógicamente arquivo com id: {}", id);
            repository.atualizarStatusParaRemovido(id);
            repository.deletarIndicesPorDocumento(id);
        } catch (Exception e) {
            logger.error("Falha ao remover arquivo: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public DadosListagemDocumentoDTO getArquivo(Integer id){

            Documento doc = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado com o ID: " + id));

            return new DadosListagemDocumentoDTO(doc);

    }

    @Transactional
    public Documento atualizarOuCriarVersao(Integer idDocumento, String novoTitulo, Integer idCategoria, MultipartFile arquivo) throws Exception {

        // 1. Busca o documento pai (o atual)
        Documento docAtual = repository.findById(idDocumento)
                .orElseThrow(() -> new EntityNotFoundException("Documento não encontrado."));

        // Busca a nova categoria (se foi enviada)
        Categoria novaCategoria = null;
        if (idCategoria != null ) {
            novaCategoria = categoriaRepository.findById(idCategoria)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada."));
        }

        // ==========================================
        // CASO 1: NÃO VEIO ARQUIVO (Apenas Update)
        // ==========================================
        if (arquivo == null || arquivo.isEmpty()) {
            if (novoTitulo != null && !novoTitulo.trim().isEmpty()) {
                docAtual.setTitulo(novoTitulo);
            }
            if (novaCategoria != null) {

                docAtual.setCategoria(novaCategoria);
            }else{
                docAtual.setCategoria(null);
            }




            docAtual.setAtualizadoEm(LocalDateTime.now());

            return repository.save(docAtual);
        }

        // ==========================================
        // CASO 2: VEIO ARQUIVO (Criar Nova Versão)
        // ==========================================

        // 2.1 Faz o upload físico do novo arquivo e gera o hash

        String nomeUnico = UUID.randomUUID() + "_" + novoTitulo;
        Path caminhoFisico = Paths.get(DIRETORIO_UPLOADS + nomeUnico);

        Files.copy(arquivo.getInputStream(), caminhoFisico, StandardCopyOption.REPLACE_EXISTING);

        String novoCaminho = caminhoFisico.toString();
        String novoHash = calcularHash(arquivo.getBytes());

        if (repository.existsByHashConteudoAtivoOuPendente(novoHash)) {
            throw new IllegalArgumentException("O arquivo '" + novoTitulo + "' já foi inserido anteriormente no sistema (conteúdo duplicado).");
        }

        // 2.2 Incrementa a versão (Ex: "1" vira "2", ou "1.0" vira "2.0")
        String novaVersao = incrementarVersao(docAtual.getNumeroVersao());

        // Inativar o documento antigo
        StatusDocumento statusInativo = statusRepository.findById(2) //  ID 2 como INATIVO
                .orElseThrow(() -> new RuntimeException("Status INATIVO não encontrado no banco."));

        docAtual.setStatusDoc(statusInativo);
        repository.save(docAtual); // Atualiza o antigo no banco
        // ----------------------------------------------------

        // 2.3 Cria o NOVO documento
        Documento docNovo = new Documento();

        // Define o título e categoria (se vieram na requisição usa os novos, senão herda do pai)
        docNovo.setTitulo(novoTitulo != null ? novoTitulo : docAtual.getTitulo());
        docNovo.setCategoria(novaCategoria);

        // Herda dados de versionamento e autoria
        if(docAtual.getDocumentoOrigem() != null){
            docNovo.setDocumentoOrigem(docAtual.getDocumentoOrigem());
        }else{
            docNovo.setDocumentoOrigem(docAtual); // Define o pai!
        }

        docNovo.setNumeroVersao(novaVersao);
        docNovo.setInseridoPor(docAtual.getInseridoPor()); // Ou pode pegar o usuário logado no contexto
        StatusDocumento statusPendente = statusRepository.findById(3) //  ID 3 como PENDENTE
                .orElseThrow(() -> new RuntimeException("Status PENDENTE não encontrado no banco."));


        docNovo.setStatusDoc(statusPendente);

        // Dados do novo arquivo
        docNovo.setCaminhoArquivo(novoCaminho);
        docNovo.setHashConteudo(novoHash);
        docNovo.setCriadoEm(LocalDateTime.now());
        docNovo.setAtualizadoEm(LocalDateTime.now());

        // Opcional, mas RECOMENDADO: Inativar a versão antiga para não aparecer nas buscas normais
        // Status 2 poderia ser "HISTORICO" ou "OBSOLETO"
        // docAtual.setStatusDoc(statusRepository.findById(2).get());
        // documentoRepository.save(docAtual);

        // 2.4 Salva e retorna o novo documento como principal

        return repository.save(docNovo);
    }

    private String incrementarVersao(String versaoAtual) {
        if (versaoAtual == null || versaoAtual.isEmpty()) return "1";

        try {
            // Se for um número com ponto (ex: 1.0)
            if (versaoAtual.contains(".")) {
                String[] partes = versaoAtual.split("\\.");
                int numeroPrincipal = Integer.parseInt(partes[0]);
                return (numeroPrincipal + 1) + ".0";
            } else {
                // Se for um número inteiro simples (ex: 1)
                int numero = Integer.parseInt(versaoAtual);
                return String.valueOf(numero + 1);
            }
        } catch (NumberFormatException e) {
            // Se o padrão for muito louco (ex: "v1-alpha"), força para "2" para evitar quebra
            return versaoAtual + "-nova-versao";
        }
    }

    public List<DadosListagemDocumentoDTO> encontrarHistorico(Integer id){

        List<Documento> docs = repository.historicoDocumento(id);

        // Correção aqui: usando ArrayList e o operador diamante <>
        List<DadosListagemDocumentoDTO> historico = new ArrayList<>();

        docs.forEach(doc -> {
            historico.add(new DadosListagemDocumentoDTO(doc));
        });

        return historico;
    }

    @Transactional
    public Integer restaurarDoc(Integer id, Integer idDocAtual){

        Documento docRestaurar = repository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado com o ID: " + id));

        StatusDocumento statusPendente = statusRepository.findById(3) //  ID 3 como PENDENTE
                .orElseThrow(() -> new RuntimeException("Status PENDENTE não encontrado no banco."));

        Documento docAtual = repository.findById(idDocAtual)
                .orElseThrow(() -> new IllegalArgumentException("Documento não encontrado com o ID: " + idDocAtual));


        StatusDocumento statusInativo = statusRepository.findById(2) //  ID 3 como PENDENTE
                .orElseThrow(() -> new RuntimeException("Status PENDENTE não encontrado no banco."));

        docAtual.setStatusDoc(statusInativo);

        repository.save(docAtual);

        Documento novoDoc = new Documento();
        novoDoc.setDocumentoOrigem(docRestaurar.getDocumentoOrigem() != null ? docRestaurar.getDocumentoOrigem() : docRestaurar );
        novoDoc.setCategoria(docRestaurar.getCategoria());
        novoDoc.setStatusDoc(statusPendente);
        novoDoc.setCriadoEm(LocalDateTime.now());
        novoDoc.setAtualizadoEm(LocalDateTime.now());
        novoDoc.setCaminhoArquivo(docRestaurar.getCaminhoArquivo());
        novoDoc.setTitulo(docRestaurar.getTitulo());
        novoDoc.setHashConteudo(docRestaurar.getHashConteudo());
        novoDoc.setInseridoPor(docRestaurar.getInseridoPor());
        novoDoc.setNumeroVersao(incrementarVersao(docAtual.getNumeroVersao()));



        return repository.save(novoDoc).getId();
    }


}