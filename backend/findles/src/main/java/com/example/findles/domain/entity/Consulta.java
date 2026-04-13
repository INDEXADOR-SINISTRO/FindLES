package com.example.findles.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "CONSULTA")
@Entity(name = "Consulta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONSULTA")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CATEGORIA")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_STATUS_CONSULTA")
    private StatusConsulta statusConsulta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario criadoPor;

    @Column(name = "TEMPO_RESPOSTA_MS", nullable = true)
    private Long tempoResposta;

    @Column(name = "DATA_CONSULTA", nullable = false)
    private LocalDateTime dataConsulta;

    @Column(name = "DATA_DE", nullable = true)
    private LocalDateTime dataDe;

    @Column(name = "DATA_ATE", nullable = true)
    private LocalDateTime dataAte;

    @Column(name = "QUANTIDADE_RESULTADO")
    private Integer quantidadeResultado ;

    @Column(name = "AVALIACAO", nullable = true)
    private Integer avaliacao ;

    @Column(name = "STRING_BUSCA", columnDefinition = "TEXT")
    private String stringBusca ;

    @Column(name = "ERRO", nullable = true, columnDefinition = "TEXT")
    private String erro ;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resultado> resultados = new ArrayList<>();




}
