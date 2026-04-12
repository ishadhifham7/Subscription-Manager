package com.ishadh.submanager.config.firestore;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
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

    @Value("${firebase.database-url:}")
    private String databaseUrl;

    @Value("${firebase.project-id:}")
    private String projectId;

    public FirestoreConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        FirebaseOptions options = buildOptions();

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        }

        return FirebaseApp.getInstance();
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        return FirestoreClient.getFirestore(firebaseApp);
    }

    private FirebaseOptions buildOptions() throws IOException {
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

            return builder.build();
        }
    }
}
