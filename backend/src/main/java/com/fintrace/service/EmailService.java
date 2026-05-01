package com.fintrace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLoginEmail(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("fintrace.app@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Login Alert - Fintrace");
            message.setText("Hello,\n\nYou have successfully logged into Fintrace using this Gmail account.\n\nIf this wasn't you, please secure your account.\n\nBest regards,\nFintrace Team");

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
