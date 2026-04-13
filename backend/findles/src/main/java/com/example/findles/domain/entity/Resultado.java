package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "RESULTADO")
@Entity(name = "Resultado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Resultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RESULTADO")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOCUMENTO", nullable = false)
    private Documento documento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONSULTA", nullable = false)
    private Consulta consulta;

    @Column(name = "TRECHO_ENCONTRADO", nullable = true)
    private String trechoEncontrado;

    @Column(name = "RELEVANCIA_SCORE")
    private Double relevanciaScore;

}
