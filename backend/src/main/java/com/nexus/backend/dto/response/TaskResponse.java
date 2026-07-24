package com.nexus.backend.dto.response;

import java.time.LocalDateTime;

import com.nexus.backend.entity.Status;

/**
 * TaskResponse
 */
public record TaskResponse(
        Long id,
        String title,
        String description,
        Status status,
        LocalDateTime createdAt) {
}
