package com.ishadh.submanager.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {

    private static final Logger log = LoggerFactory.getLogger(CurrentUserResolver.class);
    // DEV ONLY: local-dev-user is a fallback identity for local development and should not exist in production data.
    private static final String FALLBACK_USER_ID = "local-dev-user";

    public String getCurrentUserId() {
        return resolveCurrentUser().userId();
    }

    public ResolvedUser resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.debug("Resolved DEV MODE USER identity userId={} source=fallback (no authenticated principal)", FALLBACK_USER_ID);
            return new ResolvedUser(FALLBACK_USER_ID, false);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt jwt) {
            String subject = jwt.getSubject();
            if (subject != null && !subject.isBlank()) {
                log.debug("Resolved REAL USER identity userId={} source=jwt-sub", subject);
                return new ResolvedUser(subject, true);
            }
        }

        log.debug("Resolved DEV MODE USER identity userId={} source=fallback (missing jwt-sub)", FALLBACK_USER_ID);
        return new ResolvedUser(FALLBACK_USER_ID, false);
    }

    public record ResolvedUser(String userId, boolean fromJwt) {
    }
}
