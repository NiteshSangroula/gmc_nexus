package com.nexus.backend.dto.response;

/**
 * AuthResponse
 */
public record AuthResponse(
        String email,
        String token,
        int expiresIn) {
}
