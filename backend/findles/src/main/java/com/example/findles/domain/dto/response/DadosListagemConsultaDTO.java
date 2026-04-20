package com.example.findles.domain.dto.response;

import com.example.findles.domain.entity.Consulta;

import java.time.LocalDateTime;

public record DadosListagemConsultaDTO (
        String nomeUsuario,
        String nomeCategoria,
        String status,
        Long tempoResposta,
        LocalDateTime dataConsulta,
        LocalDateTime dataDe,
        LocalDateTime dataAte,
        Integer quantidadeResultado,
        Integer avaliacao,
        String stringBusca,
        String erro
) {
    public DadosListagemConsultaDTO(Consulta consulta){
        this(
            consulta.getCriadoPor().getEmail(),
            consulta.getCategoria() != null ? consulta.getCategoria().getNome() : "Sem Categoria",
            consulta.getStatusConsulta().getDescricao(),
            consulta.getTempoResposta(),
            consulta.getDataConsulta(),
            consulta.getDataDe(),
            consulta.getDataAte(),
            consulta.getQuantidadeResultado(),
            consulta.getAvaliacao(),
            consulta.getStringBusca(),
            consulta.getErro() != null ? consulta.getErro() : ""


        );

    }


}