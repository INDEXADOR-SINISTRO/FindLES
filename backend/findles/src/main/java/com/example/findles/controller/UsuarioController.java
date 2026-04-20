package com.example.findles.controller;

import com.example.findles.domain.dto.request.DadosCadastroUsuarioDTO;
import com.example.findles.domain.dto.request.DadosEditarUsuarioDTO;
import com.example.findles.domain.dto.request.EmailRecoverPasswordDTO;
import com.example.findles.domain.dto.request.RedefinirSenhaDTO;
import com.example.findles.domain.dto.response.DadosAuditoriaDTO;
import com.example.findles.domain.dto.response.DadosTokenJWTDTO;
import com.example.findles.domain.dto.response.DadosUsuarioDTO;
import com.example.findles.domain.entity.Usuario;
import com.example.findles.service.AuditoriaService;
import com.example.findles.service.TokenService;
import com.example.findles.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuditoriaService auditoriaService;

    @Autowired
    private TokenService tokenService;

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

    @PutMapping
    @Transactional
    public ResponseEntity<String> redefinirSenha(
            @RequestBody @Valid RedefinirSenhaDTO dados,
            @RequestParam String token) {

        try {
            usuarioService.redefinirSenha(dados.password(),token);
            return ResponseEntity.ok("Senha redefinida com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao redefinir senha: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<DadosUsuarioDTO>> listar(
            @RequestParam(required = false) String nomeOuEmail,
            @RequestParam(required = false) Integer idPerfil,
            @PageableDefault(size = 10, sort = {"cadastradoEm"}) Pageable paginacao) {

        var pagina = usuarioService.listar(nomeOuEmail,idPerfil,paginacao);
        return ResponseEntity.ok(pagina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editar(
            @PathVariable Integer id,
            @RequestBody @Valid DadosEditarUsuarioDTO dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        StopWatch relogio = new StopWatch();
        relogio.start();
        try {
            Integer perfilUsuarioASerEditado = usuarioService.getUsuario(id).getPerfil().getId();
            Usuario usuarioAtualizado = usuarioService.atualizarUsuario(id, dados);

            relogio.stop();

            if(dados.role().equals(perfilUsuarioASerEditado)){
                auditoriaService.criarHistorico(usuarioLogado,"Editar usuário com id " + id,"", relogio.getTotalTimeMillis());
            }else{
                if(dados.role().equals(1)){
                    auditoriaService.criarHistorico(usuarioLogado,"Tornou " + usuarioAtualizado.getEmail() + " um usuário","", relogio.getTotalTimeMillis());
                }else{
                    auditoriaService.criarHistorico(usuarioLogado,"Tornou " + usuarioAtualizado.getEmail() + " um administrador","", relogio.getTotalTimeMillis());
                }
            }

            return ResponseEntity.ok(usuarioAtualizado); // Retorna 200 OK com os novos dados


        } catch (Exception e) {
            logger.error("Erro ao Editar usuário: {}", e.getMessage());
            relogio.stop();
            auditoriaService.criarHistorico(usuarioLogado,"Editar usuário com id " + id,e.getMessage(), relogio.getTotalTimeMillis());
            return ResponseEntity.badRequest().build(); // Retorna 400 para outros erros
        }
    }

    @PostMapping("/recover")
    public ResponseEntity<String> enviarEmailRecuperacao(@RequestBody @Valid EmailRecoverPasswordDTO dados) {

        try{
            logger.info("Solicitação de recuperação de senha");
            usuarioService.sendEmailRecover(dados.email());
            return ResponseEntity.ok("Email enviado com sucesso");
        }catch(Exception e){
            logger.error("Erro ao solicitar recuperação de senha: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}