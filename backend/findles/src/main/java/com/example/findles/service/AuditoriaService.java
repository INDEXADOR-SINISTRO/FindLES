package com.example.findles.service;

import com.example.findles.domain.entity.Auditoria;
import com.example.findles.domain.dto.response.DadosAuditoriaDTO;
import com.example.findles.domain.entity.Usuario;
import com.example.findles.repository.AuditoriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Service
public class AuditoriaService {

    private static final Logger logger = LoggerFactory.getLogger(AuditoriaService.class);

    @Autowired
    private AuditoriaRepository repository;

    public Page<DadosAuditoriaDTO> listar(Pageable paginacao, String nomeOuEmail, LocalDate dataDe, LocalDate dataAte) {

        LocalDateTime dataDeConvertida = (dataDe != null) ? dataDe.atStartOfDay() : null;
        LocalDateTime dataAteConvertida = (dataAte != null) ? dataAte.atTime(LocalTime.MAX) : null;

        Page<Auditoria> auditoriasPaginadas = repository.buscarComFiltrosDinamicos(nomeOuEmail, dataDeConvertida, dataAteConvertida,paginacao);

        return auditoriasPaginadas.map(DadosAuditoriaDTO::new);
    }

    public void criarHistorico(Usuario usuario, String acao, String erro, long tempoResposta) {
        Auditoria aud = new Auditoria(usuario,acao, LocalDateTime.now(),erro,tempoResposta);
        repository.save(aud);

    }
}
