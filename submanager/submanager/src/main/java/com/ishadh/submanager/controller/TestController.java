package com.ishadh.submanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api")
public class TestController {

    // 🔓 Public endpoint
    @GetMapping("/public/hello")
    public String publicHello() {
        return "Public endpoint works";
    }

    // 🔐 Protected endpoint
    @GetMapping("/private/hello")
    public String privateHello() {
        return "Private endpoint works - you are authenticated";
    }

    @GetMapping("/private/user")
    public Object user(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims();
    }
}

