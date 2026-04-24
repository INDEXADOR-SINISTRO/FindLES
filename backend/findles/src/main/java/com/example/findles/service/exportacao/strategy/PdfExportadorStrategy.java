package com.example.findles.service.exportacao.strategy;

import com.example.findles.domain.dto.geral.TabelaExportacaoDTO;
import com.example.findles.domain.enums.FormatoExportacao;
// Troque os imports antigos por estes:
import org.openpdf.text.Document;
import org.openpdf.text.Font;
import org.openpdf.text.FontFactory;
import org.openpdf.text.PageSize;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;


import org.springframework.stereotype.Component;
import java.awt.Color;
import java.io.OutputStream;

import java.awt.Color;
import java.io.OutputStream;

@Component
public class PdfExportadorStrategy implements ExportadorStrategy {

    @Override
    public FormatoExportacao getFormato() {
        return FormatoExportacao.PDF;
    }

    @Override
    public String getContentType() {
        return "application/pdf";
    }

    @Override
    public void exportar(TabelaExportacaoDTO tabela, OutputStream out) throws Exception {
        // 1. Cria o documento (Formato A4, margens padrão)
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // 2. Adiciona o Título dinâmico (Vindo lá do Adapter)
        Font fonteTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
        Paragraph titulo = new Paragraph(tabela.titulo(), fonteTitulo);
        titulo.setAlignment(Paragraph.ALIGN_CENTER);
        titulo.setSpacingAfter(20); // Dá um espaço entre o título e a tabela
        document.add(titulo);

        // 3. Configura a Tabela do PDF (A quantidade de colunas é o tamanho do array de cabeçalho)
        int quantidadeColunas = tabela.cabecalhos().length;
        PdfPTable pdfTable = new PdfPTable(quantidadeColunas);
        pdfTable.setWidthPercentage(100); // Tabela ocupa 100% da largura da página

        // 4. Desenha o Cabeçalho da tabela com um fundo cinza para ficar elegante
        Font fonteCabecalho = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
        for (String nomeColuna : tabela.cabecalhos()) {
            PdfPCell celula = new PdfPCell(new Phrase(nomeColuna, fonteCabecalho));
            celula.setBackgroundColor(Color.DARK_GRAY);
            celula.setPadding(8);
            pdfTable.addCell(celula);
        }

        // 5. Desenha as Linhas com os dados
        Font fonteDados = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
        for (String[] linhaDeDados : tabela.linhas()) {
            for (String dado : linhaDeDados) {
                PdfPCell celula = new PdfPCell(new Phrase(dado, fonteDados));
                celula.setPadding(5);
                pdfTable.addCell(celula);
            }
        }

        // 6. Adiciona a tabela finalizada ao documento e fecha
        document.add(pdfTable);
        document.close();
    }
}