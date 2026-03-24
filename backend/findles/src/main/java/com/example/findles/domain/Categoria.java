package com.example.findles.domain;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "CATEGORIA")
@Entity(name = "Categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CATEGORIA")
    private Integer id;

    @Column(name = "NOME", nullable = false, length = 50)
    private String nome;

    @Column(name = "DESCRICAO", length = 255) // Tamanho padrão do varchar, ajuste se no seu banco for maior
    private String descricao;
}