package com.example.findles.repository;

import com.example.findles.domain.Termo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TermoRepository extends JpaRepository<Termo, Integer> {
    Optional<Termo> findByTermoNormalizado(String termoNormalizado);
}