package com.example.findles.repository;

import com.example.findles.domain.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

    @Query("SELECT d FROM Documento d WHERE " +
            "d.statusDoc.id <> 2 AND " +
            "(:titulo IS NULL OR LOWER(d.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))) AND " +
            "(:idCategoria IS NULL OR d.categoria.id = :idCategoria) AND " +
            "(cast(:dataDe as timestamp) IS NULL OR d.criadoEm >= :dataDe) AND " +
            "(cast(:dataAte as timestamp) IS NULL OR d.criadoEm <= :dataAte)")
    Page<Documento> buscarComFiltrosDinamicos(
            @Param("titulo") String titulo,
            @Param("idCategoria") Integer idCategoria,
            @Param("dataDe") LocalDateTime dataDe,
            @Param("dataAte") LocalDateTime dataAte,
            Pageable pageable);

    List<Documento> findByStatusDocId(Integer idStatus);

    boolean existsByHashConteudo(String hashConteudo);
}