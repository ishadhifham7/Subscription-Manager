package com.ishadh.submanager.config;

import com.ishadh.submanager.security.ApiRequestAuthLoggingFilter;
import com.ishadh.submanager.security.JwtAuthFailureEntryPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${require-auth:true}")
    private boolean requireAuth;

    private final ApiRequestAuthLoggingFilter apiRequestAuthLoggingFilter;
    private final JwtAuthFailureEntryPoint jwtAuthFailureEntryPoint;
    private final Environment environment;

    public SecurityConfig(
        ApiRequestAuthLoggingFilter apiRequestAuthLoggingFilter,
        JwtAuthFailureEntryPoint jwtAuthFailureEntryPoint,
        Environment environment
    ) {
        this.apiRequestAuthLoggingFilter = apiRequestAuthLoggingFilter;
        this.jwtAuthFailureEntryPoint = jwtAuthFailureEntryPoint;
        this.environment = environment;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        boolean prodProfileActive = environment.acceptsProfiles(Profiles.of("prod"));
        boolean authEnabled = requireAuth || prodProfileActive;

        log.info(
            "Security mode resolved: requireAuth={}, prodProfileActive={}, authEnabled={}",
            requireAuth,
            prodProfileActive,
            authEnabled
        );

        if (!authEnabled) {
            http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .addFilterAfter(apiRequestAuthLoggingFilter, SecurityContextHolderFilter.class)
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

            .addFilterAfter(apiRequestAuthLoggingFilter, SecurityContextHolderFilter.class)

            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthFailureEntryPoint)
            )

            // Route security
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/", "/health").permitAll()
                .requestMatchers(
                    "/api/private/**",
                    "/api/subscriptions/**",
                    "/api/categories/**",
                    "/api/remainders/**",
                    "/api/user/**"
                ).authenticated()
                .anyRequest().permitAll()
            )

            // Enable JWT validation
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            );

        return http.build();
    }
}
