package com.fintrace.controller;

import com.fintrace.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-login-email")
    public void sendEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email != null && !email.isEmpty()) {
            emailService.sendLoginEmail(email);
        }
    }
}
