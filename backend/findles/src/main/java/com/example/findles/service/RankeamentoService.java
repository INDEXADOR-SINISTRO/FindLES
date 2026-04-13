package com.example.findles.service;

import com.example.findles.domain.entity.Consulta;
import com.example.findles.domain.entity.Documento;
import com.example.findles.domain.entity.IndiceInvertido;
import com.example.findles.domain.entity.Resultado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RankeamentoService {

    @Autowired
    private SnippetService snippetService;

    public List<Resultado> rankearEGerarResultados(
            Consulta consulta,
            List<String> tokensBusca,
            List<IndiceInvertido> indicesEncontrados) {

        // 1. Agrupar os acertos por Documento e calcular o Produto Escalar (Soma do TF-IDF)
        Map<Documento, Double> produtoEscalarMap = new HashMap<>();

        for (IndiceInvertido indice : indicesEncontrados) {
            Documento doc = indice.getDocumento();
            Double tfIdfNoBanco = indice.getTfIdf();

            // Como assumimos que cada termo buscado tem peso 1 na Query, o produto escalar
            // é simplesmente ir somando os TF-IDFs dos termos que bateram naquele documento.
            double somaAtual = produtoEscalarMap.getOrDefault(doc, 0.0);
            produtoEscalarMap.put(doc, somaAtual + tfIdfNoBanco);
        }

        // 2. Calcular a Magnitude da Query (Vetor da Busca)
        // Raiz quadrada da quantidade de termos buscados (considerando peso 1 para cada)
        double magnitudeQuery = Math.sqrt(tokensBusca.size());

        List<Resultado> resultadosFinais = new ArrayList<>();

        // 3. Aplicar a fórmula do Cosseno e criar a Entidade RESULTADO
        for (Map.Entry<Documento, Double> entry : produtoEscalarMap.entrySet()) {
            Documento doc = entry.getKey();
            Double produtoEscalar = entry.getValue();

            // OBS: Se você ainda não implementou o cálculo da Magnitude no momento do upload,
            // coloquei um fallback (valor padrão) para o código não quebrar dividindo por zero.
            double magnitudeDoc = (doc.getMagnitudeDocumento() != null && doc.getMagnitudeDocumento() > 0)
                    ? doc.getMagnitudeDocumento()
                    : 1.0;

            // A MÁGICA DA SIMILARIDADE: Produto Escalar / (MagnitudeQuery * MagnitudeDoc)
            double scoreCosseno = 0.0;
            if (magnitudeQuery > 0) {
                scoreCosseno = produtoEscalar / (magnitudeQuery * magnitudeDoc);
            }

            // Instancia o novo Resultado para amarrar a Consulta e o Documento
            Resultado resultado = new Resultado();
            resultado.setConsulta(consulta);
            resultado.setDocumento(doc);

            // Garantir que a nota fique entre 0.0 e 1.0 (ou multiplique por 100 se quiser porcentagem)
            resultado.setRelevanciaScore(scoreCosseno);

            // TODO: Aqui você chamaria o seu SnippetService para preencher a string abaixo

            String trecho = snippetService.gerarSnippet(doc, tokensBusca);
            resultado.setTrechoEncontrado(trecho);

            resultadosFinais.add(resultado);
        }

        return resultadosFinais;
    }
}
