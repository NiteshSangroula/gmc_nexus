package com.nexus.backend.service;
import com.nexus.backend.dto.response.FlashcardResponse;
import java.util.List;

public interface AiService {
    List<FlashcardResponse> generateFlashCards(String text);
}