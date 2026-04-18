package com.ishadh.submanager.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final String[] LOCAL_ALLOWED_ORIGINS = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    };

    public static final String ATTR_UID = "firebaseUid";
    public static final String ATTR_EMAIL = "firebaseEmail";

    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        return !path.startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            writeUnauthorized(request, response, "Missing or invalid Authorization header");
            return;
        }

        String idToken = authorization.substring(7).trim();
        if (idToken.isEmpty()) {
            writeUnauthorized(request, response, "Missing Firebase ID token");
            return;
        }

        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
            request.setAttribute(ATTR_UID, decodedToken.getUid());
            request.setAttribute(ATTR_EMAIL, decodedToken.getEmail());
            filterChain.doFilter(request, response);
        } catch (FirebaseAuthException ex) {
            writeUnauthorized(request, response, "Invalid or expired Firebase ID token");
        }
    }

    private void writeUnauthorized(
        HttpServletRequest request,
        HttpServletResponse response,
        String message
    ) throws IOException {
        response.setHeader("Vary", "Origin");
        // Keep unauthorized responses CORS-compatible for local frontend origins.
        String origin = request.getHeader("Origin");
        if (origin == null) {
            origin = "http://localhost:5173";
        }
        for (String allowedOrigin : LOCAL_ALLOWED_ORIGINS) {
            if (allowedOrigin.equals(origin)) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                break;
            }
        }
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
