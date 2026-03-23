package com.example.findles.controller;

import com.example.findles.domain.Usuario;
import com.example.findles.dto.DadosAutenticacaoDTO;
import com.example.findles.dto.DadosTokenJWTDTO;
import com.example.findles.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class AutenticacaoController {

    // O Spring injeta aquele gerenciador que configuramos no SecurityConfigurations
    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacaoDTO dados) {
        try{

        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        // 1. Converte o nosso DTO para o formato que o Spring Security entende
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());

        // 2. Chama o gerenciador para validar (Ele vai lá no AutenticacaoService, busca no banco e compara a senha)
        var authentication = manager.authenticate(authenticationToken);

        // 3. Se a senha bater, o código chega aqui. Pegamos o usuário logado e geramos o token.
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // 4. Devolvemos o token na resposta com status 200 (OK)
        return ResponseEntity.ok(new DadosTokenJWTDTO(tokenJWT));
    }
}