package com.example.findles.service;

import com.example.findles.domain.entity.*;
import com.example.findles.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ConsultaService {
    private static final Logger logger = LoggerFactory.getLogger(ConsultaService.class);

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private IndiceInvertidoRepository indiceRepository;

    @Autowired
    private RankeamentoService rankeamentoService;

    @Autowired
    private ResultadoRepository resultadoRepository;

    @Autowired
    private StatusConsultaRepository statusConsultaRepository;

    public Integer criarConsulta(String stringBusca, List<String> tokens, Integer idCategoria, LocalDate dataDe, LocalDate dataAte, Usuario usuario) {
        StopWatch relogio = new StopWatch();
        relogio.start();

        LocalDateTime dataDeConvertida = (dataDe != null) ? dataDe.atStartOfDay() : null;
        LocalDateTime dataAteConvertida = (dataAte != null) ? dataAte.atTime(LocalTime.MAX) : null;

        // Preparando a entidade Consulta
        Consulta consulta = new Consulta();
        consulta.setDataConsulta(LocalDateTime.now());
        consulta.setCriadoPor(usuario);
        consulta.setStringBusca(stringBusca);
        consulta.setDataAte(dataAteConvertida);
        consulta.setDataDe(dataDeConvertida);

        if (idCategoria != null) {
            consulta.setCategoria(categoriaRepository.getReferenceById(idCategoria));
        }

        try {
            // 1. Busca os documentos filtrados
            List<Documento> documentos = documentoRepository.buscarComPesquisa(tokens, idCategoria, dataDeConvertida, dataAteConvertida);

            if (documentos.isEmpty()) {
                // SEM RESULTADOS (Assumindo ID 2)
                consulta.setStatusConsulta(statusConsultaRepository.getReferenceById(2));
                consulta.setQuantidadeResultado(0);

                // Salvamos a consulta mesmo sem resultados para fins de métricas
                //consulta = consultaRepository.save(consulta);

            } else {
                // 2. Temos documentos! Agora buscamos os índices deles para pegar o TF-IDF
                List<IndiceInvertido> indices = indiceRepository.buscarPorDocumentosETokens(documentos, tokens);

                // 3. Salva a Consulta ANTES para gerar o ID dela (os Resultados precisam desse ID)
                consulta.setStatusConsulta(statusConsultaRepository.getReferenceById(1)); // SUCESSO (Assumindo ID 1)
                //consulta = consultaRepository.save(consulta);

                // 4. Passa a bola para o RankeamentoService calcular o Cosseno e montar os Resultados
                List<Resultado> resultados = rankeamentoService.rankearEGerarResultados(consulta, tokens, indices);

                // 5. Salva todos os resultados de uma vez no banco
                consulta.setResultados(resultados);
                //resultadoRepository.saveAll(resultados);

                // 6. Atualiza a quantidade exata (se quiser garantir)
                consulta.setQuantidadeResultado(resultados.size());
                //consultaRepository.save(consulta);
            }

        } catch (Exception e) {
            logger.error("Erro ao realizar consulta: ", e);
            consulta.setErro(e.getMessage());
            // ERRO INTERNO (Assumindo ID 3)
            consulta.setStatusConsulta(statusConsultaRepository.getReferenceById(3));
            consulta.setQuantidadeResultado(0);

            // Salva a consulta com o erro registrado para você debugar depois
            //consultaRepository.save(consulta);
        }

        relogio.stop();

        // Atualiza o tempo de resposta e salva uma última vez
        consulta.setTempoResposta(relogio.getTotalTimeMillis()); // Cuidado com o nome do set: tempoRespostaMs ou tempoResposta
        consultaRepository.save(consulta);

        return consulta.getId();
    }
}