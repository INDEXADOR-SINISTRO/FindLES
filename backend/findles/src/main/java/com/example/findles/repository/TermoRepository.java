package com.example.findles.repository;

import com.example.findles.domain.entity.Termo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TermoRepository extends JpaRepository<Termo, Integer> {
    Optional<Termo> findByTermoNormalizado(String termoNormalizado);

    List<Termo> findByTermoNormalizadoIn(Collection<String> termos);
}