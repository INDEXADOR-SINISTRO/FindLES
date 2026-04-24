package com.example.findles.domain.dto.geral;

import java.util.List;

public record TabelaExportacaoDTO (
        String titulo,
        String[] cabecalhos,
        List<String[]> linhas
) {}