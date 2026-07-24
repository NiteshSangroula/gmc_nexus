package com.nexus.backend.dto.response;

import java.time.LocalDateTime;

/**
 * FlashCardResponse
 */
public record FlashCardResponse(
        Long id,
        String deckId,
        String deckTitle,
        String question,
        String answer,
        LocalDateTime createdAt) {
}
