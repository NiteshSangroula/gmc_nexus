package com.nexus.backend.dto.response;

import lombok.Data;

@Data
public record FlashcardResponse(String question, String answer) {
}
