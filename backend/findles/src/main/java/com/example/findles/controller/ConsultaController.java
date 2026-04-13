package com.example.findles.controller;

import com.example.findles.domain.dto.request.NovaConsultaDTO;
import com.example.findles.domain.dto.response.DadosConsultaDTO;
import com.example.findles.domain.dto.response.DadosListagemDocumentoDTO;
import com.example.findles.domain.entity.Usuario;
import com.example.findles.service.AuditoriaService;
import com.example.findles.service.ConsultaService;
import com.example.findles.service.DocumentoService;
import com.example.findles.service.ProcessadorTextoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/consulta")
public class ConsultaController {

    private static final Logger logger = LoggerFactory.getLogger(ConsultaController.class);

    @Autowired
    private ConsultaService consultaService;


    @Autowired
    private ProcessadorTextoService processador;


    @PostMapping
    public ResponseEntity<DadosConsultaDTO> realizarConsulta(
            @RequestBody NovaConsultaDTO request, // Lendo o JSON do body
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        // 1. Processa a string que veio dentro do objeto request
        List<String> tokens = Arrays.asList(processador.processar(request.busca()).split(" "));

        // 2. Chama o service passando os dados desmembrados do DTO
        Integer idConsulta = consultaService.criarConsulta(
                request.busca(),
                tokens,
                request.idCategoria(),
                request.dataDe(),
                request.dataAte(),
                usuarioLogado
        );

        return ResponseEntity.ok(new DadosConsultaDTO(idConsulta, tokens));
    }
}