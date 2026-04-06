package com.example.findles.domain.dto.response;

import com.example.findles.domain.entity.Usuario;

import java.time.LocalDateTime;

public record DadosUsuarioDTO(
    Integer id,
    LocalDateTime cadastradoEm,
    String nome,
    String email,
    String role
){
    public DadosUsuarioDTO(Usuario user) {
            this(
                    user.getId(),
                    user.getCadastradoEm(),
                    user.getNome(),
                    user.getEmail(),
                    user.getPerfil().getNome()

            );
        }

    }