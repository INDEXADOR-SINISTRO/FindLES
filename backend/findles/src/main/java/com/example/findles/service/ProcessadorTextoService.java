package com.example.findles.service;

import org.apache.lucene.analysis.*;
import org.apache.lucene.analysis.br.BrazilianAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProcessadorTextoService {

    public String processar(String textoCru) {
        if (textoCru == null || textoCru.trim().isEmpty()) {
            return "";
        }

        // Instancia o analisador focado em Português-Brasileiro
        Analyzer analyzer = new BrazilianAnalyzer();
        List<String> tokensProcessados = new ArrayList<>();

        // O TokenStream é a esteira de montagem: ele pega o texto e passa pelos 4 passos que você pediu
        try (TokenStream tokenStream = analyzer.tokenStream("conteudo", textoCru)) {
            CharTermAttribute attr = tokenStream.addAttribute(CharTermAttribute.class);
            tokenStream.reset();

            while (tokenStream.incrementToken()) {
                // Aqui a palavra já chega minúscula, sem acento, sem pontuação, sem stop words e no radical (stem)
                tokensProcessados.add(attr.toString());
            }

            tokenStream.end();
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar o texto no pipeline de NLP", e);
        } finally {
            analyzer.close();
        }

        // Junta os tokens de volta em uma única string separada por espaços
        return String.join(" ", tokensProcessados);
    }
}