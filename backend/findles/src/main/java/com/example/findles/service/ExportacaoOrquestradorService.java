package com.example.findles.service;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.enums.FormatoExportacao;
import com.example.findles.service.exportacao.adapter.EntidadeExportacaoAdapter;
import com.example.findles.service.exportacao.strategy.ExportadorStrategy;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ExportacaoOrquestradorService {

    private final Map<FormatoExportacao, ExportadorStrategy> estrategias;

    // O Spring injeta todas as estratégias aqui automaticamente
    public ExportacaoOrquestradorService(List<ExportadorStrategy> listaEstrategias) {
        this.estrategias = listaEstrategias.stream()
                .collect(Collectors.toMap(ExportadorStrategy::getFormato, Function.identity()));
    }

    public <T> void executarExportacao(
            FormatoExportacao formato,
            List<T> dadosBrutos,
            EntidadeExportacaoAdapter<T> adapter,
            String subtitulo,
            HttpServletResponse response) throws Exception {

        // 1. Descobre qual Strategy usar
        ExportadorStrategy strategy = estrategias.get(formato);
        if (strategy == null) {
            throw new IllegalArgumentException("Formato não suportado!");
        }

        // 2. O ADAPTER ENTRA EM AÇÃO: Traduz os dados do banco para a Tabela Universal
        TabelaExportacaoDTO tabelaPronta = adapter.adaptar(dadosBrutos,subtitulo);

        // 3. Configura os Headers do Navegador
        response.setContentType(strategy.getContentType());
        // Usa o título da tabela (limpando espaços) como nome do arquivo
        String nomeArquivo = tabelaPronta.titulo().replace(" ", "_").toLowerCase();
        response.setHeader("Content-Disposition", "attachment; filename=" + nomeArquivo + "." + formato.name().toLowerCase());

        // 4. A STRATEGY ENTRA EM AÇÃO: Gera o arquivo final
        strategy.exportar(tabelaPronta, response.getOutputStream());
    }
}
