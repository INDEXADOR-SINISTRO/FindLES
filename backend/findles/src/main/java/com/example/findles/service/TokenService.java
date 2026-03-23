package com.example.findles.service;

import com.example.findles.domain.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class TokenService {

    @Value("${spring.api.security.token.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
                .issuer("API Findles")
                .subject(usuario.getEmail())
                .claim("id", usuario.getId())
                .claim("role", usuario.getPerfil().getNome())
                .claim("nome", usuario.getNome())
                .issuedAt(new Date())
                .expiration(Date.from(dataExpiracao()))
                .signWith(getSigningKey())
                .compact();
    }


    public String getSubject(String tokenJWT) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey()) // Verifica se a assinatura bate
                    .build()
                    .parseSignedClaims(tokenJWT) // Se expirar ou for falso, quebra aqui
                    .getPayload();

            return claims.getSubject(); // Devolve o e-mail
        } catch (Exception e) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }


    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}