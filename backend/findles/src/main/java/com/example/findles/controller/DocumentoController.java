package com.example.findles.controller;

import com.example.findles.service.DocumentoService;
import com.example.findles.domain.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.findles.dto.DadosListagemDocumentoDTO;
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
            return ResponseEntity.status(201).body("Documentos salvos com sucesso!");
        } catch (Exception e) {
            logger.error("Erro ao indexar arquivos: {}", e.getMessage());
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
}
