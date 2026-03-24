package com.example.findles.controller;

import com.example.findles.service.DocumentoService;
import com.example.findles.domain.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        try{
            logger.info("Anexando documentos: {} documentos",arquivos.size());
            documentoService.salvarDocumentos(arquivos, idCategoria, usuarioLogado);
            return ResponseEntity.status(201).body("Documentos salvos com sucesso!");
        }catch (Exception e){
            logger.error("Erro ao indexar arquivos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}