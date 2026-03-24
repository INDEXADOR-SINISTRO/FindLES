package com.example.findles.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "DOCUMENTO")
@Entity(name = "Documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DOCUMENTO")
    private Integer id; // Usando Integer porque no banco é SERIAL (32 bits)

    // Chave Estrangeira: Categoria (Pode ser nula)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CATEGORIA")
    private Categoria categoria;

    // Chave Estrangeira: Quem fez o upload
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_INSERIDO_POR", nullable = false)
    private Usuario inseridoPor;

    // Chave Estrangeira (Auto-relacionamento): Versão anterior do documento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOCUMENTO_ORIGEM")
    private Documento documentoOrigem;

    // Chave Estrangeira: Status do documento (Pendente, Indexado, Erro)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_STATUS_DOC", nullable = false)
    private StatusDocumento statusDoc;

    @Column(name = "CAMINHO_ARQUIVO", nullable = false)
    private String caminhoArquivo;

    @Column(name = "TITULO", nullable = false, length = 50)
    private String titulo;

    @Column(name = "ATUALIZADO_EM", nullable = false)
    private LocalDateTime atualizadoEm;

    @Column(name = "CRIADO_EM", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "HASH_CONTEUDO", nullable = false, length = 100)
    private String hashConteudo;

    @Column(name = "NUMERO_VERSAO", nullable = false, length = 50)
    private String numeroVersao;
}