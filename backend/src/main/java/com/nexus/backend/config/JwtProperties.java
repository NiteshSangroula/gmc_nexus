package com.nexus.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JwtProperties
 */
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        long expiration) {
}
