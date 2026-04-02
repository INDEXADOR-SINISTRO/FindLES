package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "AUDITORIA")
@Entity(name = "Auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_AUDITORIA")
    private Integer id; // Usando Integer porque no banco é SERIAL (32 bits)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario acionadoPor;

    @Column(name = "ACAO", nullable = false, length = 150)
    private String acao;

    @Column(name = "DATA", nullable = false)
    private LocalDateTime data;

    @Column(name = "LOG_ERRO", nullable = true, columnDefinition = "TEXT")
    private String logErro;

    public Auditoria(Usuario acionadoPor, String acao, LocalDateTime data){
        this.acionadoPor = acionadoPor;
        this.acao = acao;
        this.data = data;
    }

    public Auditoria(Usuario acionadoPor, String acao, LocalDateTime data, String logErro){
        this.acionadoPor = acionadoPor;
        this.acao = acao;
        this.data = data;
        this.logErro = logErro;
    }


}
