package com.example.findles.service.exportacao.adapter;


import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;

import java.util.List;

public interface EntidadeExportacaoAdapter<T> {
    // Pega uma lista de qualquer coisa e devolve a nossa Tabela Universal
    TabelaExportacaoDTO adaptar(List<T> entidades);
}