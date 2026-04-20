package com.example.findles.repository;

import com.example.findles.domain.entity.Documento;
import com.example.findles.domain.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE " +
            "(:nomeOuEmail IS NULL OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :nomeOuEmail, '%'))) AND " +
            "(:idPerfil IS NULL OR u.perfil.id = :idPerfil)")
    Page<Usuario> buscarComFiltrosDinamicos(
            @Param("nomeOuEmail") String nomeOuEmail,
            @Param("idPerfil") Integer idPerfil,
            Pageable pageable);

    UserDetails findByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Usuario encontrarUsuarioPeloEmail(@Param("email") String email);

    Usuario findById(Integer id);

    boolean existsByEmail(String email);
}