package com.ishadh.submanager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApiRequestAuthLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiRequestAuthLoggingFilter.class);

    private final CurrentUserResolver currentUserResolver;

    public ApiRequestAuthLoggingFilter(CurrentUserResolver currentUserResolver) {
        this.currentUserResolver = currentUserResolver;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path == null || !path.startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        CurrentUserResolver.ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();

        filterChain.doFilter(request, response);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean jwtAuthenticated = authentication instanceof JwtAuthenticationToken;
        boolean anonymous = authentication instanceof AnonymousAuthenticationToken;
        String authStatus = jwtAuthenticated ? "JWT" : (anonymous ? "ANONYMOUS" : "DEV_FALLBACK");

        log.debug(
            "apiRequest method={} endpoint={} status={} authStatus={} resolvedUserId={} jwtPresent={}",
            request.getMethod(),
            request.getRequestURI(),
            response.getStatus(),
            authStatus,
            resolvedUser.userId(),
            resolvedUser.fromJwt()
        );
    }
}
