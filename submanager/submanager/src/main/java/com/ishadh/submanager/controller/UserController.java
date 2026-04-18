package com.ishadh.submanager.controller;

import com.ishadh.submanager.model.User;
import com.ishadh.submanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final String DEFAULT_UID = "local-dev-user";
    private static final String DEFAULT_EMAIL = "local-dev-user@subscriptionmanager.local";

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() throws Exception {
        return ResponseEntity.ok(userService.getByUid(DEFAULT_UID));
    }

    @PostMapping
    public ResponseEntity<User> createOrFetchUser() throws Exception {
        return ResponseEntity.ok(userService.createOrFetch(DEFAULT_UID, DEFAULT_EMAIL));
    }
}
