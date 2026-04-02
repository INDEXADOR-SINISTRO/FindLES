package com.example.findles.repository;


import com.example.findles.domain.entity.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {
    Page<Auditoria> findAll(Pageable pageable);
}
