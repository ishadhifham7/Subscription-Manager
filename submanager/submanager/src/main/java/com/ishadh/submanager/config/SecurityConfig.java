package com.ishadh.submanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Value("${require-auth:true}")
    private boolean requireAuth;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        if (!requireAuth) {
            http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
                );

            return http.build();
        }

        http
            // Disable CSRF (we use stateless JWT)
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(Customizer.withDefaults())

            // Route security
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()   // open endpoints
                .anyRequest().authenticated()                     // everything else protected
            )

            // Enable JWT validation
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            );

        return http.build();
    }
}
