package com.nexus.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
@org.springframework.scheduling.annotation.EnableAsync
public class BackendApplication {
    static {
        try {
            java.nio.file.Path envPath = java.nio.file.Paths.get(".env");
            // If running inside the /backend directory, search one directory level up
            if (!java.nio.file.Files.exists(envPath)) {
                envPath = java.nio.file.Paths.get("../.env");
            }
            if (java.nio.file.Files.exists(envPath)) {
                System.out.println("[Bootstrap] Loading environment variables from .env: " + envPath.toAbsolutePath());
                java.nio.file.Files.readAllLines(envPath).forEach(line -> {
                    if (line.contains("=") && !line.trim().startsWith("#")) {
                        String[] parts = line.split("=", 2);
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        // Force override in System properties to take precedence over OS environment
                        System.setProperty(key, value);
                    }
                });
                System.out.println("[Bootstrap] Environment variables loaded successfully.");
            } else {
                System.out.println("[Bootstrap] WARNING: No .env file found at " + envPath.toAbsolutePath());
            }
        } catch (Exception e) {
            System.err.println("[Bootstrap] Failed to load .env file: " + e.getMessage());
        }
    }
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
