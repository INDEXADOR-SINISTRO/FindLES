package com.example.findles.repository;

import com.example.findles.domain.entity.Documento;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

@Repository
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

    @Query("SELECT d FROM Documento d WHERE " +
            "d.statusDoc.id = 1 AND " +
            "(:idCategoria IS NULL OR d.categoria.id = :idCategoria) AND " +
            "(cast(:dataDe as timestamp) IS NULL OR d.criadoEm >= :dataDe) AND " +
            "(cast(:dataAte as timestamp) IS NULL OR d.criadoEm <= :dataAte) AND " +
            "EXISTS (SELECT 1 FROM IndiceInvertido i WHERE i.documento = d AND i.termo.termoNormalizado IN :tokens)")
    List<Documento> buscarComPesquisa(
            @Param("tokens") List<String> tokens,
            @Param("idCategoria") Integer idCategoria,
            @Param("dataDe") LocalDateTime dataDe,
            @Param("dataAte") LocalDateTime dataAte
    );



    @Transactional
    @Modifying
    @Query("UPDATE Documento d SET d.statusDoc.id = 2 WHERE d.id = :id")
    void atualizarStatusParaRemovido(@Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("DELETE FROM IndiceInvertido i WHERE i.documento.id = :id")
    void deletarIndicesPorDocumento(@Param("id") Integer id);

    List<Documento> findByStatusDocId(Integer idStatus);

    @Query("SELECT d FROM Documento d WHERE d.id = :id OR d.documentoOrigem.id = :id ORDER BY d.id desc")
    List<Documento> historicoDocumento(@Param("id") Integer id);

    @Query("SELECT COUNT(d) > 0 FROM Documento d WHERE d.hashConteudo = :hash AND d.statusDoc.id IN (1, 3, 4)")
    boolean existsByHashConteudoAtivoPendenteOuInvalido(@Param("hash") String hash);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM RESULTADO WHERE ID_DOCUMENTO IN (" +
            "   SELECT d.ID_DOCUMENTO FROM DOCUMENTO d " +
            "   LEFT JOIN DOCUMENTO orig ON d.ID_DOCUMENTO_ORIGEM = orig.ID_DOCUMENTO " +
            "   WHERE d.ID_STATUS_DOC = 2 " +
            "   AND (d.ID_DOCUMENTO_ORIGEM IS NULL OR orig.ID_STATUS_DOC = 2) " +
            "   AND NOT EXISTS (" +
            "       SELECT 1 FROM DOCUMENTO doc_filho " +
            "       WHERE doc_filho.ID_DOCUMENTO_ORIGEM = d.ID_DOCUMENTO " +
            "       AND doc_filho.ID_STATUS_DOC <> 2" +
            "   )" +
            ")", nativeQuery = true)
    void deletarResultadosPorDocumento();


    @Query(value = "SELECT d.* FROM DOCUMENTO d " +
            "LEFT JOIN DOCUMENTO orig ON d.ID_DOCUMENTO_ORIGEM = orig.ID_DOCUMENTO " +
            "WHERE d.ID_STATUS_DOC = 2 " +
            "AND (d.ID_DOCUMENTO_ORIGEM IS NULL OR orig.ID_STATUS_DOC = 2) " +
            "AND NOT EXISTS (" +
            "   SELECT 1 FROM DOCUMENTO doc_filho " +
            "   WHERE doc_filho.ID_DOCUMENTO_ORIGEM = d.ID_DOCUMENTO " +
            "   AND doc_filho.ID_STATUS_DOC <> 2" +
            ")", nativeQuery = true)
    List<Documento> buscarDocumentosInativosParaDeletar();


    @Transactional
    @Modifying
    @Query(value = "DELETE FROM DOCUMENTO WHERE ID_DOCUMENTO IN (" +
            "   SELECT d.ID_DOCUMENTO FROM DOCUMENTO d " +
            "   LEFT JOIN DOCUMENTO orig ON d.ID_DOCUMENTO_ORIGEM = orig.ID_DOCUMENTO " +
            "   WHERE d.ID_STATUS_DOC = 2 " +
            "   AND (d.ID_DOCUMENTO_ORIGEM IS NULL OR orig.ID_STATUS_DOC = 2) " +
            "   AND NOT EXISTS (" +
            "       SELECT 1 FROM DOCUMENTO doc_filho " +
            "       WHERE doc_filho.ID_DOCUMENTO_ORIGEM = d.ID_DOCUMENTO " +
            "       AND doc_filho.ID_STATUS_DOC <> 2" +
            "   )" +
            ")", nativeQuery = true)
    void deletarDocumentosInativos();

    long countByStatusDocId(Integer statusId);
}