package com.example.findles.repository;

import com.example.findles.domain.entity.Documento;
import com.example.findles.domain.entity.IndiceInvertido;
import com.example.findles.domain.entity.Termo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndiceInvertidoRepository extends JpaRepository<IndiceInvertido, Integer> {
    List<IndiceInvertido> findByTermo(Termo termo);

    List<IndiceInvertido> findByDocumento(Documento doc);

    @Query("SELECT i FROM IndiceInvertido i " +
            "WHERE i.documento IN :documentos " +
            "AND i.termo.termoNormalizado IN :tokens")
    List<IndiceInvertido> buscarPorDocumentosETokens(
            @Param("documentos") List<Documento> documentos,
            @Param("tokens") List<String> tokens
    );

    List<IndiceInvertido> findByDocumentoIn(List<Documento> documentos);
}
