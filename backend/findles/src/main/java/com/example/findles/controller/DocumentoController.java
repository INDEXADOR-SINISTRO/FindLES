package com.example.findles.controller;

import com.example.findles.service.AuditoriaService;
import com.example.findles.service.DocumentoService;
import com.example.findles.domain.entity.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
            // Pega o usuário que está logado no momento pelo Token JWT!
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        try {
            logger.info("Anexando documentos: {} documentos", arquivos.size());
            documentoService.salvarDocumentos(arquivos, idCategoria, usuarioLogado);
            auditoriaService.criarHistorico(usuarioLogado,"Fazer Upload de arquivos no sistema","");
            return ResponseEntity.status(201).body("Documentos salvos com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao indexar arquivos: {}", e.getMessage());
            auditoriaService.criarHistorico(usuarioLogado,"Fazer Upload de arquivos no sistema",e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
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

    @GetMapping("/{id}")
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
        try {
            // O Service faz todo o trabalho pesado (Tika + Update no Postgres) e devolve o total de sucessos
            int quantidadeIndexada = documentoService.indexarDocumentosPendentes();

            // A regra exata que você pediu: se for 0, avisa que não tinha nada
            if (quantidadeIndexada == 0) {
                return ResponseEntity.ok("Não tinham documentos para indexar.");
            }

            // Se processou 1 ou mais, devolve a mensagem de sucesso com a quantidade
            auditoriaService.criarHistorico(usuarioLogado,"Indexar arquivos pendentes: " +  quantidadeIndexada + " documento(s)","");
            return ResponseEntity.ok(quantidadeIndexada + " documento(s) indexado(s) com sucesso e atualizado(s) para ATIVO!");

        } catch (Exception e) {
            // Para capturar qualquer erro fatal que escape do loop de processamento
            auditoriaService.criarHistorico(usuarioLogado,"Indexar arquivos pendentes",e.getMessage());
            return ResponseEntity.internalServerError().body("Erro interno na rotina de indexação: " + e.getMessage());
        }
    }
}
