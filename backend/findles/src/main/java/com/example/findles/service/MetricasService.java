package com.example.findles.service;

import com.example.findles.domain.dto.response.GraficoDiarioDTO;
import com.example.findles.domain.dto.response.MetricasDTO;
import com.example.findles.repository.ConsultaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;


@Service
public class MetricasService {

    private static final Logger logger = LoggerFactory.getLogger(MetricasService.class);

    @Autowired
    private ConsultaRepository consultaRepository;

    public MetricasDTO getMetricas(LocalDate dataDe,LocalDate dataAte){
        LocalDateTime dataDeConvertida = (dataDe != null) ? dataDe.atStartOfDay() : null;
        LocalDateTime dataAteConvertida = (dataAte != null) ? dataAte.atTime(LocalTime.MAX) : null;
        MetricasDTO metricas = consultaRepository.calcularMetricasGerais(dataDeConvertida,dataAteConvertida);
        List<GraficoDiarioDTO> grafico = consultaRepository.buscarDadosParaGrafico();
        metricas.setGrafico(grafico);
        return metricas;

    }
}
