package com.ishadh.submanager.modules.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private static final String DEFAULT_UID = "local-dev-user";

    @Autowired
    private SubscriptionService service;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @RequestBody SubscriptionRequest request
    ) throws Exception {

        return ResponseEntity.ok(service.createSubscription(request, DEFAULT_UID));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions()
            throws Exception {

        return ResponseEntity.ok(service.getAllSubscriptions(DEFAULT_UID));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(
            @PathVariable String id
    ) throws Exception {

        boolean deleted = service.deleteSubscription(id, DEFAULT_UID);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}