package com.example.findles.config;

import com.example.findles.controller.UsuarioController;
import com.example.findles.repository.UsuarioRepository;
import com.example.findles.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Pega o token do cabeçalho da requisição
        var tokenJWT = recuperarToken(request);
        try {
            // 2. Se tiver um token, vamos validar
            if (tokenJWT != null) {

                // Extrai o e-mail (subject) de dentro do token. Se for inválido, o TokenService lança erro aqui.
                var subject = tokenService.getSubject(tokenJWT);

                // Busca o usuário completo no banco de dados
                var usuario = repository.findByEmail(subject);

                // 3. Cria o objeto de autenticação que o Spring Security entende, passando as permissões (authorities)
                var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());

                // 4. Força o login do usuário para esta requisição específica
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            // 5. Continua o fluxo da requisição (vai para o próximo filtro ou para o Controller)
            filterChain.doFilter(request, response);
        }catch(RuntimeException ex){
            logger.error("token inválido: {}", ex.getMessage());
        }
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null) {
            // O padrão do mercado é mandar o token escrito assim: "Bearer eeyJhbGciOiJIUzI1Ni..."
            // Então nós removemos a palavra "Bearer " para sobrar só o código JWT puro.
            return authorizationHeader.replace("Bearer ", "");
        }

        return null;
    }
}