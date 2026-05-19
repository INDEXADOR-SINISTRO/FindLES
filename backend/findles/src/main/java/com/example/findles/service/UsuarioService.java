package com.example.findles.service;

import com.example.findles.domain.dto.request.DadosEditarUsuarioDTO;

import com.example.findles.domain.dto.response.DadosUsuarioDTO;

import com.example.findles.domain.entity.Usuario;
import com.example.findles.domain.dto.request.DadosCadastroUsuarioDTO;
import com.example.findles.domain.mapper.UsuarioMapper;
import com.example.findles.repository.PerfilUsuarioRepository;
import com.example.findles.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

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

    public Page<DadosUsuarioDTO> listar(String nomeOuEmail, Integer idPerfil, Pageable paginacao) {
;

        // O repositório faz todo o trabalho pesado de ignorar o que for null
        Page<Usuario> usuariosPaginados = usuarioRepository.buscarComFiltrosDinamicos(
                nomeOuEmail,
                idPerfil,
                paginacao
        );

        return usuariosPaginados.map(DadosUsuarioDTO::new);
    }

    @Transactional
    public Usuario atualizarUsuario(Integer id, DadosEditarUsuarioDTO dados) throws Exception {
        // 1. Busca o usuário que já existe no banco de dados
        try{
            logger.info("Editando usuário com id: {}", id);



            Usuario usuarioExistente = usuarioRepository.findById(id);
            // 2. Atualiza apenas os campos que podem ser modificados pelo front-end
            usuarioExistente.setNome(dados.nome());
            usuarioExistente.setEmail(dados.email());


            var novoPerfil = perfilRepository.findById(dados.role())
                    .orElseThrow(() -> new RuntimeException("Perfil não encontrado no banco de dados."));
            usuarioExistente.setPerfil(novoPerfil);


            // 3. Salva e retorna o usuário atualizado
            logger.info("Usuário de id {} Editado com sucesso",usuarioExistente.getId());
            return usuarioRepository.saveAndFlush(usuarioExistente);

        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Tentativa de editar um usuário recusada, email já cadastrado");
        }catch (Exception e){
            throw e;
        }

    }

    public void sendEmailRecover (String email) {
        try{

            Usuario usuario = usuarioRepository.encontrarUsuarioPeloEmail(email);
            if (usuario == null) {
                throw new IllegalArgumentException(email + " não encontrado");
            }
            String tokenJWT = tokenService.gerarTokenRecover(usuario);
            String linkRecuperacao = "http://localhost:3000/redefinir-senha?token=" + tokenJWT;
            emailService.enviarEmailRecuperacaoSenha(usuario.getEmail(),linkRecuperacao);
        }catch (Exception e){
            throw e;
        }

    }

    public void redefinirSenha (String password, String token) {
        try{
            String email = tokenService.getSubject(token);
            logger.info("Redefinindo senha do usuario {}",email);
            Usuario usuario = usuarioRepository.encontrarUsuarioPeloEmail(email);
            usuario.setSenha(passwordEncoder.encode(password));
            usuarioRepository.save(usuario);
            logger.info("Senha redefinida com sucesso!");
        }catch (Exception e){
            throw e;
        }

    }

    public Usuario getUsuario (Integer id) {
        try{
            return usuarioRepository.findById(id);
        }catch (Exception e){
            throw e;
        }

    }
}