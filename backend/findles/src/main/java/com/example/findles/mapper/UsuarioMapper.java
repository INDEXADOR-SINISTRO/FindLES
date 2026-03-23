package com.example.findles.mapper;

import com.example.findles.domain.Usuario;
import com.example.findles.dto.DadosCadastroUsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    // Ignoramos o ID (banco gera), o Perfil (Service busca) e a Senha (Service criptografa)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "perfil", ignore = true)
    @Mapping(target = "senha", ignore = true)
    // Pedimos para o MapStruct já preencher a data atual no momento da conversão
    @Mapping(target = "cadastradoEm", expression = "java(java.time.LocalDateTime.now())")
    Usuario toEntity(DadosCadastroUsuarioDTO dto);
}