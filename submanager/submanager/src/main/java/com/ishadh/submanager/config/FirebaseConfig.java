package com.ishadh.submanager.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
public class FirebaseConfig {

    private final ResourceLoader resourceLoader;

    @Value("${firebase.credentials.path}")
    private String credentialsPath;

    @Value("${firebase.database-url:}")
    private String databaseUrl;

    @Value("${firebase.project-id:}")
    private String projectId;

    public FirebaseConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        Resource credentialsResource = resourceLoader.getResource(credentialsPath);

        try (var serviceAccountStream = credentialsResource.getInputStream()) {
            FirebaseOptions.Builder builder = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountStream));

            if (databaseUrl != null && !databaseUrl.isBlank()) {
                builder.setDatabaseUrl(databaseUrl);
            }

            if (projectId != null && !projectId.isBlank()) {
                builder.setProjectId(projectId);
            }

            return FirebaseApp.initializeApp(builder.build());
        }
    }
}
