package com.ishadh.submanager.modules.subscription;

import com.ishadh.submanager.security.CurrentUserResolver;
import com.ishadh.submanager.security.CurrentUserResolver.ResolvedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionController.class);

    @Autowired
    private SubscriptionService service;

    @Autowired
    private CurrentUserResolver currentUserResolver;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @RequestBody SubscriptionRequest request
    ) throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/subscriptions method=POST jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        return ResponseEntity.ok(service.createSubscription(request, resolvedUser.userId()));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions()
            throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/subscriptions method=GET jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        return ResponseEntity.ok(service.getAllSubscriptions(resolvedUser.userId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(
            @PathVariable String id
    ) throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/subscriptions/{} method=DELETE jwtPresent={} resolvedUserId={} authStatus={}", id, resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        boolean deleted = service.deleteSubscription(id, resolvedUser.userId());

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}