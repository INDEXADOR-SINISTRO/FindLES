package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "STATUS_CONSULTA")
@Entity(name = "StatusConsulta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class StatusConsulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_STATUS_CONSULTA")
    private Integer id;

    @Column(name = "DESCRICAO", length = 255)
    private String descricao;
}
