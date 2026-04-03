package com.example.findles.repository;

import com.example.findles.domain.entity.IndiceInvertido;
import com.example.findles.domain.entity.Termo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndiceInvertidoRepository extends JpaRepository<IndiceInvertido, Integer> {
    List<IndiceInvertido> findByTermo(Termo termo);
}
