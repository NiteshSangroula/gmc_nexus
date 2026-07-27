package com.nexus.backend.dto.response;

public record DeckInteractionResponse(
    String deckId,
    long likes,
    long dislikes,
    String userReaction
) {}
