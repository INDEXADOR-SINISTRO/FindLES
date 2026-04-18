package com.example.findles.controller;

import com.example.findles.service.AuditoriaService;
import com.example.findles.service.DocumentoService;
import com.example.findles.domain.entity.Usuario;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.findles.domain.dto.response.DadosListagemDocumentoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;


import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.util.StopWatch;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @Autowired
    private AuditoriaService auditoriaService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentoController.class);


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> fazerUpload(
            @RequestParam("arquivos") List<MultipartFile> arquivos,
            @RequestParam(value = "idCategoria", required = false) Integer idCategoria,
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {

            logger.info("Anexando documentos: {} documentos", arquivos.size());
            documentoService.salvarDocumentos(arquivos, idCategoria, usuarioLogado);
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Fazer Upload de arquivos no sistema","",relogio.getTotalTimeMillis());
            return ResponseEntity.status(201).body("Documentos salvos com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao indexar arquivos: {}", e.getMessage());
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Fazer Upload de arquivos no sistema",e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PutMapping(value = "/editar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> atualizarDocumento(
            @PathVariable Integer id,
            @RequestParam(value = "titulo", required = false) String titulo,
            @RequestParam(value = "idCategoria", required = false) Integer idCategoria,
            @RequestParam(value = "arquivo", required = false) MultipartFile arquivo,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {
            // Chama o serviço passando todos os parâmetros. O arquivo pode ser nulo.
            logger.info("Editar arquivo {}:", id);
            var editouOuCriouVersao = documentoService.atualizarOuCriarVersao(id, titulo, idCategoria, arquivo);
            relogio.stop();
            if(editouOuCriouVersao.getId().equals(id)){
                logger.info("Arquivo editado com sucesso {}: ", id);
                auditoriaService.criarHistorico(usuarioLogado,"Editar arquivo de id " + id,"",relogio.getTotalTimeMillis());

            }else{
                logger.info("Versão {} do arquivo {} foi criada ",editouOuCriouVersao.getNumeroVersao(), id);
                auditoriaService.criarHistorico(usuarioLogado,"Criou a versão " + editouOuCriouVersao.getNumeroVersao() + " do arquivo " + id ,"",relogio.getTotalTimeMillis());

            }


            return ResponseEntity.ok("Arquivo atualizado");

        } catch (EntityNotFoundException e) {
            logger.error("Erro ao editar arquivo: {}", e.getMessage());
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Editar arquivo de id " + id,e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erro ao editar arquivo: {}", e.getMessage());
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Editar arquivo de id " + id,e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar documento: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<Page<DadosListagemDocumentoDTO>> listar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Integer idCategoria,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAte,
            @PageableDefault(size = 10, sort = {"criadoEm"}) Pageable paginacao) {

        var pagina = documentoService.listar(titulo, idCategoria, dataDe, dataAte, paginacao);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping(value="/historico/{id}")
    public ResponseEntity<List<DadosListagemDocumentoDTO>> historicoDocumento(@PathVariable Integer id) {
        var historico = documentoService.encontrarHistorico(id);
        return ResponseEntity.ok(historico);
    }

    @GetMapping("/abrir/{id}")
    public ResponseEntity<Resource> abrirPdf(@PathVariable Integer id) {

        logger.info("Abrir arquivo com id: {}", id);
        Resource arquivo = documentoService.carregarArquivoComoRecurso(id);

        // MediaType.APPLICATION_PDF avisa o navegador que é um PDF.
        // O "inline" avisa o navegador para ABRIR o arquivo na tela.
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + arquivo.getFilename() + "\"")
                .body(arquivo);
    }

    @PostMapping("/indexar-pendentes")
    public ResponseEntity<String> iniciarIndexacaoEmLote(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {
            // O Service faz todo o trabalho pesado (Tika + Update no Postgres) e devolve o total de sucessos
            int quantidadeIndexada = documentoService.indexarDocumentosPendentes();

            // A regra exata que você pediu: se for 0, avisa que não tinha nada
            if (quantidadeIndexada == 0) {
                return ResponseEntity.ok("Não tinham documentos para indexar.");
            }
            relogio.stop();
            // Se processou 1 ou mais, devolve a mensagem de sucesso com a quantidade
            auditoriaService.criarHistorico(usuarioLogado,"Indexar arquivos pendentes: " +  quantidadeIndexada + " documento(s)","",relogio.getTotalTimeMillis());
            return ResponseEntity.ok(quantidadeIndexada + " documento(s) indexado(s)");

        } catch (Exception e) {
            relogio.stop();
            // Para capturar qualquer erro fatal que escape do loop de processamento
            auditoriaService.criarHistorico(usuarioLogado,"Indexar arquivos pendentes",e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.internalServerError().body("Erro interno na rotina de indexação: " + e.getMessage());
        }
    }

    @PostMapping("/calcular-tfidf")
    public ResponseEntity<String> calcularTfIdf(
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {
            // É recomendado rodar isso de forma assíncrona (@Async) em produção,
            // pois pode demorar vários minutos dependendo do tamanho da base.
            documentoService.calcularTfIdfDeTodaABase();
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Calcular tf-idf de documentos ativos" ,"",relogio.getTotalTimeMillis());
            return ResponseEntity.ok("Processo de cálculo de TF-IDF finalizado com sucesso.");
        } catch (Exception e){
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Calcular tf-idf de documentos ativos",e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.internalServerError().body("Erro ao calcular TF-IDF: " + e.getMessage());
        }
    }

    @DeleteMapping("/remover/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Integer id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        StopWatch relogio = new StopWatch();
        relogio.start();

        try {
            documentoService.removerLogicamente(id);
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Remover arquivo com id " + id,"", relogio.getTotalTimeMillis());
            return ResponseEntity.ok("Arquivo com id " + id + " removido com sucesso");
        } catch (Exception e) {
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Remover arquivo com id " + id, e.getMessage(), relogio.getTotalTimeMillis());
            return ResponseEntity.internalServerError().body("Erro ao remover arquivo " + id + ": " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Integer id) {
        try {
            var arquivo = documentoService.getArquivo(id);
            return ResponseEntity.ok(arquivo);

        } catch (Exception e) {
            logger.error("Erro ao buscar o arquivo {}: {}",id, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Erro ao buscar o arquivo " + id + ": " + e.getMessage());
        }
    }


    @PostMapping("/restaurar/{id}")
    public ResponseEntity<?> restaurarDocumento(
            @PathVariable Integer id,
            @RequestBody @Valid Integer idDocAtual,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {
            logger.info("Restaurando documento com id: {}",id );
            var idNovoDoc = documentoService.restaurarDoc(id,idDocAtual);
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Restaurar documento com id " + id,"", relogio.getTotalTimeMillis());
            return ResponseEntity.ok(idNovoDoc);

        } catch (Exception e) {

            logger.error("Erro ao restaturar arquivo {}: {}",id, e.getMessage());
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Indexar arquivos pendentes",e.getMessage(),relogio.getTotalTimeMillis());
            return ResponseEntity.internalServerError().body("Erro ao restaurar documento: " + e.getMessage());
        }
    }
}
