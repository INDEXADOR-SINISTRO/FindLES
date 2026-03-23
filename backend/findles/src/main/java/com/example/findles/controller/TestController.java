package com.example.findles.controller;

import com.example.findles.dto.DadosCadastroUsuarioDTO;
import com.example.findles.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @Transactional // Mantemos o Transactional aqui na borda da aplicação
    public ResponseEntity<String> cadastrar(@RequestBody @Valid DadosCadastroUsuarioDTO dados, UriComponentsBuilder uriBuilder) {

        try {
            // O Controller apenas delega o trabalho pesado para o Service
            var usuarioSalvo = usuarioService.cadastrarUsuario(dados);

            // Monta a URI de resposta e devolve 201 Created
            var uri = uriBuilder.path("/usuarios/{id}").buildAndExpand(usuarioSalvo.getId()).toUri();

            return ResponseEntity.created(uri).body("Usuário cadastrado com sucesso!");

        } catch (IllegalArgumentException e) {
            // Se o Service reclamar (ex: email duplicado), devolvemos o erro 400 Bad Request
            logger.error("Erro ao cadastrar usuário: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}