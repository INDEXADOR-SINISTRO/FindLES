package com.example.findles.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class GraficoDiarioDTO{

    private LocalDate data;
    private Long totalConsultas;
    private Double tempoMedio;

    public GraficoDiarioDTO(java.sql.Date dataBanco, Long totalConsultas, Double tempoMedio) {

        this.data = dataBanco != null ? dataBanco.toLocalDate() : null;
        this.totalConsultas = totalConsultas;
        this.tempoMedio = tempoMedio;
    }


}