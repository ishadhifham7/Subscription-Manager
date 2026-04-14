package com.ishadh.submanager.modules.subscription;

import com.ishadh.submanager.security.FirebaseAuthFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService service;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @RequestBody SubscriptionRequest request,
            HttpServletRequest servletRequest
    ) throws Exception {

        String uid = requireUid(servletRequest);
        return ResponseEntity.ok(service.createSubscription(request, uid));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions(
            HttpServletRequest servletRequest
    )
            throws Exception {

        String uid = requireUid(servletRequest);
        return ResponseEntity.ok(service.getAllSubscriptions(uid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(
            @PathVariable String id,
            HttpServletRequest servletRequest
    ) throws Exception {

        String uid = requireUid(servletRequest);
        boolean deleted = service.deleteSubscription(id, uid);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private String requireUid(HttpServletRequest request) {
        Object uidAttr = request.getAttribute(FirebaseAuthFilter.ATTR_UID);
        if (uidAttr == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return uidAttr.toString();
    }
}