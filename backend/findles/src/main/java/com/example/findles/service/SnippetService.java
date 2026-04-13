package com.example.findles.service;

import com.example.findles.domain.entity.Documento;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;

@Service
public class SnippetService {

    // Quantidade de caracteres que queremos ao redor da palavra encontrada
    private static final int JANELA_CARACTERES = 100;
    private static final int TAMANHO_MAXIMO_SNIPPET = 250;

    public String gerarSnippet(Documento documento, List<String> tokensBusca) {
        String texto = documento.getTextoCru();

        // Proteção contra documentos sem texto
        if (texto == null || texto.trim().isEmpty()) {
            return "";
        }

        // Variáveis para encontrar a primeira ocorrência de qualquer token
        String textoLower = texto.toLowerCase();
        int melhorIndice = -1;

        // 1. Procurar a posição do primeiro token que der "match" no texto
        for (String token : tokensBusca) {
            // Ignoramos tokens muito pequenos (como "e", "a", "o") se existirem
            if (token.length() < 3) continue;

            int idx = textoLower.indexOf(token.toLowerCase());
            if (idx != -1 && (melhorIndice == -1 || idx < melhorIndice)) {
                melhorIndice = idx;
            }
        }

        String trechoRecortado;

        // 2. Se não achou a palavra exata (as vezes o Lucene cortou muito a palavra),
        // ou se não tem tokens válidos, retornamos o começo do documento.
        if (melhorIndice == -1) {
            int fim = Math.min(texto.length(), TAMANHO_MAXIMO_SNIPPET);
            trechoRecortado = texto.substring(0, fim) + "...";
        } else {
            // 3. Achou! Vamos calcular o recorte (a janela)
            int inicio = Math.max(0, melhorIndice - JANELA_CARACTERES);
            int fim = Math.min(texto.length(), melhorIndice + TAMANHO_MAXIMO_SNIPPET - JANELA_CARACTERES);

            // Ajuste fino: Tentar não cortar a palavra no meio do prefixo
            if (inicio > 0) {
                int espacoMaisProximo = texto.indexOf(" ", inicio);
                if (espacoMaisProximo != -1 && espacoMaisProximo < melhorIndice) {
                    inicio = espacoMaisProximo + 1;
                }
            }

            // Ajuste fino: Tentar não cortar a palavra no meio do sufixo
            if (fim < texto.length()) {
                int ultimoEspaco = texto.lastIndexOf(" ", fim);
                if (ultimoEspaco > inicio) {
                    fim = ultimoEspaco;
                }
            }

            // 4. Montar a string com reticências
            String prefixo = inicio > 0 ? "..." : "";
            String sufixo = fim < texto.length() ? "..." : "";

            // Removemos quebras de linha para o JSON ficar limpo no front-end
            trechoRecortado = prefixo + texto.substring(inicio, fim).replace("\n", " ").replace("\r", "") + sufixo;
        }

        // 5. Destacar as palavras (Highlighting)
        return trechoRecortado;
    }

    private String destacarTokens(String texto, List<String> tokens) {
        String textoDestacado = texto;

        for (String token : tokens) {
            if (token.length() < 3) continue;

            // Usamos Regex (?i) para ignorar Case Sensitive (Maiúsculo/Minúsculo).
            // O $1 preserva a palavra original do texto (com acentos e formatação),
            // apenas envolvendo ela nas tags <b> </b>
            textoDestacado = textoDestacado.replaceAll("(?i)(" + Matcher.quoteReplacement(token) + ")", "<b>$1</b>");
        }

        return textoDestacado;
    }
}