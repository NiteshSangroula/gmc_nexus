package com.nexus.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BackendApplication {
    static {
        try {
            java.nio.file.Path envPath = java.nio.file.Paths.get(".env");
            // If running inside the /backend directory, search one directory level up
            if (!java.nio.file.Files.exists(envPath)) {
                envPath = java.nio.file.Paths.get("../.env");
            }
            if (java.nio.file.Files.exists(envPath)) {
                java.nio.file.Files.readAllLines(envPath).forEach(line -> {
                    if (line.contains("=") && !line.trim().startsWith("#")) {
                        String[] parts = line.split("=", 2);
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        // Only set if not already defined in the OS environment
                        if (System.getenv(key) == null && System.getProperty(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                });
                System.out.println("[Bootstrap] Loaded environment variables from .env file successfully.");
            }
        } catch (Exception e) {
            System.err.println("[Bootstrap] Failed to load .env file: " + e.getMessage());
        }
    }
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
