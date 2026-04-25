package com.example.findles.service.exportacao.adapter;
import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.entity.Consulta;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ConsultaAdapter implements EntidadeExportacaoAdapter<Consulta> {

    @Override
    public TabelaExportacaoDTO adaptar(List<Consulta> consultas,String subtitulo) {
        String[] cabecalhos = {"ID","Usuário", "Data", "Tempo (ms)","Qtd resultados", "Status", "Avaliação", "Pesquisa"};

        // Transforma cada Consulta em um array de Strings (uma linha da tabela)
        List<String[]> linhas = consultas.stream()
                .map(c -> new String[]{
                        c.getId().toString(),
                        c.getCriadoPor().getEmail(),
                        c.getDataConsulta().toString(),
                        c.getTempoResposta().toString(),
                        String.valueOf(c.getQuantidadeResultado()),
                        c.getErro() == null ? "OK" : "ERRO",
                        c.getAvaliacao() == null ? "Não avaliada" : String.valueOf(c.getAvaliacao()),
                        c.getStringBusca()
                }).toList();

        return new TabelaExportacaoDTO("Histórico de Consultas",subtitulo, cabecalhos, linhas);
    }
}
