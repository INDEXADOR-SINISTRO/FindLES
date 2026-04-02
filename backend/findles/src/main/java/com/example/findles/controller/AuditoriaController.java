package com.example.findles.controller;

import com.example.findles.domain.dto.response.DadosAuditoriaDTO;
import com.example.findles.service.AuditoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    @Autowired
    private AuditoriaService auditoriaService;

    private static final Logger logger = LoggerFactory.getLogger(AuditoriaController.class);

    @GetMapping
    public ResponseEntity<Page<DadosAuditoriaDTO>> listar(
            @PageableDefault(size = 10, sort = {"data"}) Pageable paginacao) {

        var pagina = auditoriaService.listar(paginacao);
        return ResponseEntity.ok(pagina);
    }

}
