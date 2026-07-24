package com.nexus.backend.service;

import java.util.List;

import com.nexus.backend.dto.response.FlashCardResponse;
import com.nexus.backend.entity.FlashCard;

/**
 * FlashCardService
 */
public interface FlashCardService {

    public List<FlashCardResponse> generate(Long userId, String pdfText, String deckTitle);

    public List<FlashCard> getByUser(Long userId);

    public void delete(Long flashcardId, Long userId);

}
