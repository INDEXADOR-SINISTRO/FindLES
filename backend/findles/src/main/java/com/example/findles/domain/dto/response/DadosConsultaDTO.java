package com.example.findles.domain.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record DadosConsultaDTO(
        Integer id,
        List<String> tokens
        ) {

}


