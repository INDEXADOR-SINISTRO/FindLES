package com.example.findles.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "USUARIO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USUARIO")
    private Integer id;

    // Relacionamento com a tabela de Perfis
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_PERFIL_DE_USUARIO")
    private PerfilUsuario perfil;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "CADASTRADO_EM")
    private LocalDateTime cadastradoEm;

    @Column(name = "SENHA")
    private String senha;

    // ====================================================================
    // MÉTODOS OBRIGATÓRIOS DA INTERFACE UserDetails (Spring Security)
    // ====================================================================

    // Retorna a lista de perfis/permissões que este usuário tem
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Como no seu diagrama 1 Usuário tem 1 Perfil, retornamos uma lista com esse único perfil
        return List.of(this.perfil);
    }

    // Retorna a senha criptografada do banco para o Spring comparar
    @Override
    public String getPassword() {
        return this.senha;
    }

    // Retorna o que usamos como "login" (no nosso caso, o e-mail)
    @Override
    public String getUsername() {
        return this.email;
    }

    // Os métodos abaixo são para controle de bloqueio de conta.
    // Como seu diagrama não tem campos de "conta bloqueada", vamos deixar todos como true (liberados).

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}