package com.example.findles.controller;

import com.example.findles.domain.dto.response.DadosListagemDocumentoDTO;
import com.example.findles.domain.dto.response.ResultadoBuscaDTO;
import com.example.findles.service.ResultadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
@RestController
@RequestMapping("/api/resultado")
public class ResultadoController {

    @Autowired
    private ResultadoService resultadoService;

    @GetMapping
    public ResponseEntity<Page<ResultadoBuscaDTO>> listar(
            @RequestParam Integer idConsulta,
            @PageableDefault(size = 10, sort = {"relavanciaScore"}) Pageable paginacao) {

        var pagina = resultadoService.listar(idConsulta, paginacao);
        return ResponseEntity.ok(pagina);
    }
}
