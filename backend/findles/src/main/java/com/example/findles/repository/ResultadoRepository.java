package com.example.findles.repository;

import com.example.findles.domain.entity.Documento;
import com.example.findles.domain.entity.Resultado;
import com.example.findles.domain.entity.StatusDocumento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ResultadoRepository extends JpaRepository<Resultado, Integer> {
    @Query("SELECT r FROM Resultado r WHERE  r.consulta.id = :idConsulta ORDER BY r.relevanciaScore DESC" )
    Page<Resultado> buscarPorConsulta(
            @Param("idConsulta") Integer idConsulta,
            Pageable pageable);
}