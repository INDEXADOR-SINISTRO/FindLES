package com.example.findles.domain.dto.request;

import com.example.findles.domain.entity.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosEditarUsuarioDTO(
        @NotBlank
        String nome,

        @Email
        @NotBlank
        String email,

        Integer role
) {


}
