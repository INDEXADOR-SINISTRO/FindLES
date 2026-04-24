package com.example.findles.service.exportacao.adapter;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.entity.Auditoria;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuditoriaAdapter implements EntidadeExportacaoAdapter<Auditoria> {

    @Override
    public TabelaExportacaoDTO adaptar(List<Auditoria> auditorias) {
        String[] cabecalhos = {"ID","Usuário", "Data", "Tempo (ms)", "Status","Ação"};

        // Transforma cada Consulta em um array de Strings (uma linha da tabela)
        List<String[]> linhas = auditorias.stream()
                .map(a -> new String[]{
                        a.getId().toString(),
                        a.getAcionadoPor().getEmail(),
                        a.getData().toString(),
                        a.getTempoResposta().toString(),
                        a.getLogErro().isEmpty() ? "OK" : "ERRO",
                        a.getAcao()
                }).toList();

        return new TabelaExportacaoDTO("Histórico de Auditoria", cabecalhos, linhas);
    }
}
