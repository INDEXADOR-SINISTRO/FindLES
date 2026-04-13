package com.example.findles.domain.dto.request;

import java.time.LocalDate;

public record NovaConsultaDTO(
        String busca,
        Integer idCategoria,
        LocalDate dataDe,
        LocalDate dataAte
) {}