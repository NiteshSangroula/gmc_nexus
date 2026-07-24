package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * TaskRequest
 */
public record TaskRequest(
        @NotBlank @Size(max = 255) String title,

        @Size(max = 1000) String description) {
}
