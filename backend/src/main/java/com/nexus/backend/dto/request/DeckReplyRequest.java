package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record DeckReplyRequest(
    @NotBlank(message = "Message cannot be empty")
    String message
) {}
