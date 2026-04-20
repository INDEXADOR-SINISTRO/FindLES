package com.example.findles.repository;


import com.example.findles.domain.entity.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {
    @Query("SELECT a FROM Auditoria a WHERE " +
            "(:nomeOuEmail IS NULL OR LOWER(a.acionadoPor.nome) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%')) OR LOWER(a.acionadoPor.email) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%'))) AND " +
            "(cast(:dataDe as timestamp) IS NULL OR a.data>= :dataDe) AND " +
            "(cast(:dataAte as timestamp) IS NULL OR a.data <= :dataAte)")
    Page<Auditoria> buscarComFiltrosDinamicos(
            @Param("nomeOuEmail") String nomeOuEmail,
            @Param("dataDe") LocalDateTime dataDe,
            @Param("dataAte") LocalDateTime dataAte,
            Pageable pageable);
}
