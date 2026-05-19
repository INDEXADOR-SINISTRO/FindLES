package com.example.findles.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;


    public void enviarEmailRecuperacaoSenha(String destinatario, String linkRecuperacao) {
        try {
            logger.info("Preparando envio de e-mail de recuperação para: {}", destinatario);

            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom(remetente);
            mensagem.setTo(destinatario);
            mensagem.setSubject("Findles - Recuperação de Senha");

            String corpo = "Olá!\n\n" +
                    "Recebemos uma solicitação para redefinir a sua senha no Findles.\n" +
                    "Para cadastrar uma nova senha, clique no link abaixo:\n\n" +
                    linkRecuperacao + "\n\n" +
                    "Se você não solicitou essa alteração, apenas ignore este e-mail.\n\n" +
                    "Atenciosamente,\nEquipe Findles";

            mensagem.setText(corpo);

            mailSender.send(mensagem);

            logger.info("E-mail de recuperação enviado com sucesso para: {}", destinatario);

        } catch (Exception e) {
            logger.error("Falha ao enviar e-mail de recuperação para {}: {}", destinatario, e.getMessage());
            throw e;
        }
    }
}