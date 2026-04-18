package com.example.findles.controller;

import com.example.findles.domain.dto.response.MetricasDTO;
import com.example.findles.service.MetricasService;
import com.example.findles.service.ResultadoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/metricas")
public class MetricasController {

    private static final Logger logger = LoggerFactory.getLogger(MetricasController.class);

    @Autowired
    private MetricasService metricasService;
    @Autowired
    private ResultadoService resultadoService;

    @GetMapping
    public ResponseEntity<MetricasDTO> getMetricas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataDe,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataAte
            ){

        var metricas = metricasService.getMetricas(dataDe,dataAte);
        return ResponseEntity.ok(metricas);

    }
}
