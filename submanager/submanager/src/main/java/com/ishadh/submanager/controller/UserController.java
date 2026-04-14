package com.ishadh.submanager.controller;

import com.ishadh.submanager.model.User;
import com.ishadh.submanager.security.FirebaseAuthFilter;
import com.ishadh.submanager.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) throws Exception {
        String uid = requireUid(request);
        return ResponseEntity.ok(userService.getByUid(uid));
    }

    @PostMapping
    public ResponseEntity<User> createOrFetchUser(HttpServletRequest request) throws Exception {
        String uid = requireUid(request);
        String email = (String) request.getAttribute(FirebaseAuthFilter.ATTR_EMAIL);
        return ResponseEntity.ok(userService.createOrFetch(uid, email));
    }

    private String requireUid(HttpServletRequest request) {
        String uid = (String) request.getAttribute(FirebaseAuthFilter.ATTR_UID);
        if (uid == null || uid.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return uid;
    }
}
