package com.example.findles.domain.dto.response;

import com.example.findles.domain.entity.Resultado;

public record ResultadoBuscaDTO(
        Integer id,
        Integer idConsulta,
        DadosListagemDocumentoDTO documento,
        String trechoEncontrado,
        Double relevanciaScore,
        String busca

) {
    public ResultadoBuscaDTO(Resultado resultado){
                this(
                    resultado.getId(),
                    resultado.getConsulta().getId(),
                    new DadosListagemDocumentoDTO(resultado.getDocumento()),
                    resultado.getTrechoEncontrado(),
                    resultado.getRelevanciaScore(),
                    resultado.getConsulta().getStringBusca()
                );


    }


}
