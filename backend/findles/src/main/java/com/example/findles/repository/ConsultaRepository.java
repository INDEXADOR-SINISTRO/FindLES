package com.example.findles.repository;

import com.example.findles.domain.entity.Consulta;
import com.example.findles.domain.entity.StatusDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

}