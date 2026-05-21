package com.example.findles.domain.dto.geral;

import java.util.List;

public record TabelaExportacaoDTO (
        String titulo,
        String subtitulo,
        String[] cabecalhos,
        List<String[]> linhas
) {}