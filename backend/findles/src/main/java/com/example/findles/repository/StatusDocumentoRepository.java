package com.example.findles.repository;

import com.example.findles.domain.entity.StatusDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusDocumentoRepository extends JpaRepository<StatusDocumento, Integer> {
}