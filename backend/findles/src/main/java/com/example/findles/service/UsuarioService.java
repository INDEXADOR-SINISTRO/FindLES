package com.example.findles.service;

import com.example.findles.domain.Usuario;
import com.example.findles.dto.DadosCadastroUsuarioDTO;
import com.example.findles.mapper.UsuarioMapper;
import com.example.findles.repository.PerfilUsuarioRepository;
import com.example.findles.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilUsuarioRepository perfilRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioMapper usuarioMapper;

    public Usuario cadastrarUsuario(DadosCadastroUsuarioDTO dados) {
        logger.info("Tentando cadastrar usuário com e-mail: {}", dados.email());
        // 1. Regra de Negócio: E-mail único
        if (usuarioRepository.findByEmail(dados.email()) != null) {
            throw new IllegalArgumentException("E-mail já cadastrado!");
        }

        // 2. Busca o perfil padrão
        var perfilUser = perfilRepository.findByNome("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Perfil ROLE_USER não encontrado no banco de dados."));

        // 3. O MapStruct faz o trabalho chato (copia nome, email e gera a data de cadastro)
        Usuario novoUsuario = usuarioMapper.toEntity(dados);

        // 4. Nós lidamos apenas com as regras sensíveis
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
        novoUsuario.setPerfil(perfilUser);
        logger.info("Usuário cadastrado com id: {}", novoUsuario.getId());
        // 5. Salva e retorna
        return usuarioRepository.save(novoUsuario);
    }
}