package com.example.findles.domain;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "STATUS_DOCUMENTO")
@Entity(name = "StatusDocumento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class StatusDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_STATUS_DOC")
    private Integer id;

    @Column(name = "NOME", nullable = false, length = 50)
    private String nome;

    @Column(name = "DESCRICAO", length = 255)
    private String descricao;
}
