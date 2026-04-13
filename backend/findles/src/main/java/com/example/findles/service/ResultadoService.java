package com.example.findles.service;

import com.example.findles.domain.dto.response.DadosConsultaDTO;
import com.example.findles.domain.dto.response.DadosListagemDocumentoDTO;
import com.example.findles.domain.dto.response.ResultadoBuscaDTO;
import com.example.findles.domain.entity.Documento;
import com.example.findles.domain.entity.Resultado;
import com.example.findles.repository.ResultadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class ResultadoService {

    @Autowired
    private ResultadoRepository repository;

    @GetMapping
    public Page<ResultadoBuscaDTO> listar(Integer id, Pageable paginacao) {
        Page<Resultado> resultadosPaginados = repository.buscarPorConsulta(
                id,
                paginacao
        );

        return resultadosPaginados.map(ResultadoBuscaDTO::new);
    }
}
