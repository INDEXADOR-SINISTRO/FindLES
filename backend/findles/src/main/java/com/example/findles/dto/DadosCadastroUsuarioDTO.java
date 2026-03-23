package com.example.findles.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DadosCadastroUsuarioDTO(
        @NotBlank String nome,

        @NotBlank @Email String email,

        @NotBlank @Size(min = 4, message = "A senha deve ter no mínimo 4 caracteres")
        String senha
) {
}