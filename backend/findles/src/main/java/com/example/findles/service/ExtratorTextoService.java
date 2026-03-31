package com.example.findles.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class ExtratorTextoService {

    // O Tika é a ferramenta oficial do ecossistema Java para ler o interior de PDFs, Word, Excel, etc.
    private final Tika tika;

    public ExtratorTextoService() {
        this.tika = new Tika();
        // O Tika é gigantesco e consegue ler até 100.000 caracteres de uma vez por padrão.
        // Se os seus PDFs forem livros imensos, você pode aumentar esse limite configurando o parser dele.
        this.tika.setMaxStringLength(-1); // -1 desabilita o limite de caracteres
    }

    public String extrairTextoDoPdf(String caminhoArquivoFisico) {
        try {
            File arquivoPdf = new File(caminhoArquivoFisico);

            if (!arquivoPdf.exists()) {
                throw new RuntimeException("Arquivo não encontrado no servidor para indexação: " + caminhoArquivoFisico);
            }

            // O Tika abre o arquivo, descobre que é um PDF, lê página por página e devolve uma String gigante
            String textoCru = tika.parseToString(arquivoPdf);

            // Uma pequena limpeza básica só para tirar quebras de linha excessivas e espaços duplos
            return textoCru.replaceAll("\\s+", " ").trim();

        } catch (IOException | TikaException e) {
            throw new RuntimeException("Falha catastrófica ao tentar ler o interior do PDF: " + caminhoArquivoFisico, e);
        }
    }
}