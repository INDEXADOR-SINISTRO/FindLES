package com.example.findles.domain.dto.response;

import com.example.findles.domain.entity.Auditoria;

import java.time.LocalDateTime;

public record DadosAuditoriaDTO(
        Integer id,
        LocalDateTime data,
        String nomeUsuario,
        String acao,
        String logErro,
        Long tempoResposta
) {
    public DadosAuditoriaDTO(Auditoria auditoria) {
        this(
                auditoria.getId(),
                auditoria.getData(),
                auditoria.getAcionadoPor().getEmail(),
                auditoria.getAcao(),
                auditoria.getLogErro() != null ? auditoria.getLogErro() : "",
                auditoria.getTempoResposta()
        );
    }

}
