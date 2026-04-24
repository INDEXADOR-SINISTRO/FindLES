package com.example.findles.service.exportacao.strategy;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.enums.FormatoExportacao;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.io.OutputStreamWriter;

@Component
public class CsvExportadorStrategy implements ExportadorStrategy {

    @Override
    public FormatoExportacao getFormato() { return FormatoExportacao.CSV; }

    @Override
    public String getContentType() { return "text/csv"; }

    @Override
    public void exportar(TabelaExportacaoDTO tabela, OutputStream out) throws Exception {
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {

            // 1. Escreve o cabeçalho
            writer.writeNext(tabela.cabecalhos());

            // 2. Escreve todas as linhas de uma vez
            writer.writeAll(tabela.linhas());
        }
    }
}
