package com.ishadh.submanager.config.firestore;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@Configuration
@ConditionalOnProperty(name = "firebase.enabled", havingValue = "true")
public class FirestoreConfig {

    private final ResourceLoader resourceLoader;

    @Value("${firebase.credentials.path}")
    private String credentialsPath;

    @Value("${firebase.project-id:}")
    private String projectId;

    public FirestoreConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public Firestore firestore() throws IOException {
        Resource credentialsResource = resourceLoader.getResource(credentialsPath);

        GoogleCredentials credentials;
        try (var serviceAccountStream = credentialsResource.getInputStream()) {
            credentials = GoogleCredentials.fromStream(serviceAccountStream);
        }

        FirestoreOptions.Builder builder = FirestoreOptions.newBuilder()
            .setCredentials(credentials);

        if (projectId != null && !projectId.isBlank()) {
            builder.setProjectId(projectId);
        }

        return builder.build().getService();
    }
}
