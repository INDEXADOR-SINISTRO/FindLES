package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TERMO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Termo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TERMO")
    private Integer id;

    @Column(name= "TERMO_NORMALIZADO",unique = true, nullable = false)
    private String termoNormalizado;

    public Termo(String termoNormalizado) {
        this.termoNormalizado = termoNormalizado;
    }

}
