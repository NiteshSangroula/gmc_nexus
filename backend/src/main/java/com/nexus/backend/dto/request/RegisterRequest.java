package com.nexus.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * RegisterRequest
 */
public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, max = 128) String password,
        String username) {
}
