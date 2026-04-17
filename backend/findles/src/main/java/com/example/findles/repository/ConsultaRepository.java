package com.example.findles.repository;

import com.example.findles.domain.entity.Consulta;
import com.example.findles.domain.entity.Documento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    @Query("SELECT c FROM Consulta c WHERE " +
            "(:nomeOuEmail IS NULL OR LOWER(c.criadoPor.nome) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%')) OR LOWER(c.criadoPor.email) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%'))) AND " +
            "(cast(:dataDe as timestamp) IS NULL OR c.dataConsulta>= :dataDe) AND " +
            "(cast(:dataAte as timestamp) IS NULL OR c.dataConsulta <= :dataAte)")
    Page<Consulta> buscarComFiltrosDinamicos(
            @Param("nomeOuEmail") String nomeOuEmail,
            @Param("dataDe") LocalDateTime dataDe,
            @Param("dataAte") LocalDateTime dataAte,
            Pageable pageable);

    @Query("SELECT c FROM Consulta c WHERE " +
            "(:nomeOuEmail IS NULL OR LOWER(c.criadoPor.nome) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%')) OR LOWER(c.criadoPor.email) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%'))) AND " +
            "(cast(:dataDe as timestamp) IS NULL OR c.dataConsulta >= :dataDe) AND " +
            "(cast(:dataAte as timestamp) IS NULL OR c.dataConsulta <= :dataAte) AND " +
            "(c.erro IS NOT NULL OR c.quantidadeResultado = 0)")
    Page<Consulta> buscarComFiltrosDinamicosErros(
            @Param("nomeOuEmail") String nomeOuEmail,
            @Param("dataDe") LocalDateTime dataDe,
            @Param("dataAte") LocalDateTime dataAte,
            Pageable pageable);

    Consulta findById(Long id);
}