package com.example.findles.controller;

import com.example.findles.domain.dto.response.DadosListagemConsultaDTO;
import com.example.findles.domain.entity.Auditoria;
import com.example.findles.domain.entity.Consulta;
import com.example.findles.domain.entity.Resultado;
import com.example.findles.domain.enums.FormatoExportacao;
import com.example.findles.repository.AuditoriaRepository;
import com.example.findles.repository.ConsultaRepository;
import com.example.findles.service.AuditoriaService;
import com.example.findles.service.ConsultaService;
import com.example.findles.service.ExportacaoOrquestradorService;
import com.example.findles.service.ResultadoService;
import com.example.findles.service.exportacao.adapter.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/exportar")
public class ExportacaoController {

    @Autowired
    private ExportacaoOrquestradorService exportadorService;

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private ConsultaAdapter consultaAdapter;

    @Autowired
    private AuditoriaAdapter auditoriaAdapter;

    @Autowired
    private ResultadoAdapter resultadoAdapter;

    @Autowired
    private AuditoriaService auditoriaService;

    @Autowired
    private ResultadoService resultadoService;

    @GetMapping("/consulta/{formato}")
    public void exportarConsultas(
            @RequestParam(required = false) String nomeOuEmail,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAte,
            @RequestParam(required = true) Boolean onlyErro,
            @PathVariable FormatoExportacao formato,
            HttpServletResponse response) throws Exception {


        List<Consulta> dados = consultaService.listarRelatorio(nomeOuEmail,dataDe,dataAte,onlyErro);
        exportadorService.executarExportacao(formato, dados, consultaAdapter, response);
       }


    @GetMapping("/auditoria/{formato}")
    public void exportarAuditorias(
            @RequestParam(required = false) String nomeOuEmail,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAte,
            @PathVariable FormatoExportacao formato,
            HttpServletResponse response) throws Exception {


        List<Auditoria> dados = auditoriaService.listarRelatorio(nomeOuEmail,dataDe,dataAte);

        exportadorService.executarExportacao(formato, dados, auditoriaAdapter, response);
    }

    @GetMapping("/resultado/{formato}")
    public void exportarResultados(
            @RequestParam Integer idConsulta,
            @PathVariable FormatoExportacao formato,
            HttpServletResponse response) throws Exception {

        List<Resultado> dados = resultadoService.listarRelatorio(idConsulta);
        exportadorService.executarExportacao(formato, dados, resultadoAdapter, response);
    }
}
