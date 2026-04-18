package com.ishadh.submanager.controller;

import com.ishadh.submanager.model.User;
import com.ishadh.submanager.security.CurrentUserResolver;
import com.ishadh.submanager.security.CurrentUserResolver.ResolvedUser;
import com.ishadh.submanager.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final CurrentUserResolver currentUserResolver;

    public UserController(UserService userService, CurrentUserResolver currentUserResolver) {
        this.userService = userService;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() throws Exception {
        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/user/me method=GET jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");
        return ResponseEntity.ok(userService.getByUid(resolvedUser.userId()));
    }

    @PostMapping
    public ResponseEntity<User> createOrFetchUser() throws Exception {
        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/user method=POST jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");
        String email = resolvedUser.fromJwt() ? null : resolvedUser.userId() + "@subscriptionmanager.local";
        return ResponseEntity.ok(userService.createOrFetch(resolvedUser.userId(), email));
    }
}
