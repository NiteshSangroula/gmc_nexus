package com.nexus.backend.dto.request;

/**
 * LoginRequest
 */
public record LoginRequest(
        String email,
        String password) {
}
