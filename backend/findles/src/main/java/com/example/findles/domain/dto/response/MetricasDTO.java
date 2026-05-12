package com.example.findles.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetricasDTO {

    private Long totalConsultas;
    private Double mediaTempoResposta;
    private Double mediaResultadosBusca;
    private Long consultasSemResultado;
    private Double avaliacaoMedia;
    private List<GraficoDiarioDTO> grafico;

   public MetricasDTO(
           Long totalConsultas,
           Double mediaTempoResposta,
           Double mediaResultadosBusca,
           Long consultasSemResultado,
           Double avaliacaoMedia
   ){
       this.totalConsultas = totalConsultas;
       this.mediaTempoResposta = mediaTempoResposta;
       this.mediaResultadosBusca = mediaResultadosBusca;
       this.consultasSemResultado = consultasSemResultado;
       this.avaliacaoMedia = avaliacaoMedia;

   }



}
