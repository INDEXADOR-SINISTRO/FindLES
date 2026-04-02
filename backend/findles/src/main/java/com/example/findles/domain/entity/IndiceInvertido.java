package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "INDICE_INVERTIDO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class IndiceInvertido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_INDICE_INVERTIDO")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ID_DOCUMENTO", nullable = false)
    private Documento documento;

    @ManyToOne
    @JoinColumn(name = "ID_TERMO", nullable = false)
    private Termo termo;

    @Column(name = "FREQUENCIA")
    private Integer frequencia;

    @Column(name = "TF_IDF")
    private Double tfIdf; // Deixamos como Double/Float, já que permitimos nulo na migration


    public IndiceInvertido(Documento documento, Termo termo, Integer frequencia) {
        this.documento = documento;
        this.termo = termo;
        this.frequencia = frequencia;
    }
}