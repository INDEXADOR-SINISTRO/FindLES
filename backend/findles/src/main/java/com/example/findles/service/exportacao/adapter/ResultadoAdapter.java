package com.example.findles.service.exportacao.adapter;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.entity.Resultado;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResultadoAdapter implements EntidadeExportacaoAdapter<Resultado> {

    @Override
    public TabelaExportacaoDTO adaptar(List<Resultado> resultado,String subtitulo) {
        String[] cabecalhos = {"ID","Documento", "Relevância", "Trecho encontrado"};

        // Transforma cada Consulta em um array de Strings (uma linha da tabela)
        List<String[]> linhas = resultado.stream()
                .map(r -> new String[]{
                        r.getId().toString(),
                        r.getDocumento().getTitulo(),
                        String.valueOf(r.getRelevanciaScore()),
                        r.getTrechoEncontrado()
                }).toList();

        return new TabelaExportacaoDTO(resultado.getFirst().getConsulta().getStringBusca(),subtitulo, cabecalhos, linhas);
    }
}
