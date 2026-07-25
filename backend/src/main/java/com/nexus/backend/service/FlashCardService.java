package com.nexus.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nexus.backend.dto.request.FlashCardRequest;
import com.nexus.backend.dto.response.FlashCardResponse;
import com.nexus.backend.entity.FlashCard;

/**
 * FlashCardService
 */
public interface FlashCardService {

    public List<FlashCardResponse> generate(Long userId, String pdfText, String deckTitle, int count);

    public List<FlashCard> getByUser(Long userId);

    public void delete(Long flashcardId, Long userId);

    public FlashCardResponse createFlashCard(Long userId, FlashCardRequest request);

    public Page<FlashCardResponse> getAllFlashCards(Long userId, Pageable pageable);

    public FlashCardResponse getFlashCardById(Long userId, Long flashcardId);

    public FlashCardResponse updateFlashCard(Long userId, Long flashcardId, FlashCardRequest request);

    public void deleteFlashCard(Long userId, Long flashcardId);

    public void deleteDeck(Long userId, String deckId); 

    public Page<FlashCardResponse> getPublicFlashCards(Pageable pageable);

}
