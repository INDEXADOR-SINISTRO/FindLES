package com.example.findles.controller;

import com.example.findles.domain.dto.request.ConsultaAvaliacaoDTO;
import com.example.findles.domain.dto.request.NovaConsultaDTO;
import com.example.findles.domain.dto.response.DadosAuditoriaDTO;
import com.example.findles.domain.dto.response.DadosConsultaDTO;
import com.example.findles.domain.dto.response.DadosListagemConsultaDTO;
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

    @PutMapping
    public ResponseEntity<String> avaliarConsulta(
            @RequestBody ConsultaAvaliacaoDTO request
            ){
        try{
            logger.info("Avaliando consulta com id: {}",request.idConsulta() );
            consultaService.avaliar(request);
            return ResponseEntity.ok("Consulta avaliada com sucesso");
        }catch (Exception e){
            logger.error("Erro ao avaliar a consulta {}: {}",request.idConsulta(), e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }


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

    @GetMapping
    public ResponseEntity<Page<DadosListagemConsultaDTO>> listar(
            @RequestParam(required = false) String nomeOuEmail,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAte,
            @RequestParam(required = true) Boolean onlyErro,
            @PageableDefault(size = 10, sort = {"dataConsulta"}) Pageable paginacao) {

        var pagina = consultaService.listar(paginacao, nomeOuEmail,dataDe,dataAte, onlyErro);
        return ResponseEntity.ok(pagina);
    }
}