package com.nexus.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * FlashCardRequest
 */
public record FlashCardRequest(
        String deckId,
        String deckTitle,
        @NotBlank(message = "Question is required") String question,
        @NotBlank(message = "Answer is required") String answer) {
}

