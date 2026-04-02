package com.example.findles.domain.dto.response;

import com.example.findles.domain.entity.Documento;

import java.time.LocalDateTime;

public record DadosListagemDocumentoDTO(
        Integer id,
        String titulo,
        String nomeCategoria,
        String nomeStatus,
        String nomeUsuario,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm,
        String numeroVersao,
        String caminhoArquivo
) {
    // Construtor que converte a Entidade Documento para este DTO
    public DadosListagemDocumentoDTO(Documento documento) {
        this(
                documento.getId(),
                documento.getTitulo(),
                // Como a Categoria pode ser nula, fazemos uma checagem rápida
                documento.getCategoria() != null ? documento.getCategoria().getNome() : "Sem Categoria",
                documento.getStatusDoc().getNome(),
                documento.getInseridoPor().getEmail(),
                documento.getCriadoEm(),
                documento.getAtualizadoEm(),
                documento.getNumeroVersao(),
                documento.getCaminhoArquivo()
        );
    }
}