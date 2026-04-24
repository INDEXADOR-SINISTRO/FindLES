package com.example.findles.service.exportacao.strategy;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.enums.FormatoExportacao;

import java.io.OutputStream;

public interface ExportadorStrategy {
    FormatoExportacao getFormato();
    String getContentType();

    // Agora a Strategy só aceita a Tabela Universal!
    void exportar(TabelaExportacaoDTO tabela, OutputStream out) throws Exception;
}