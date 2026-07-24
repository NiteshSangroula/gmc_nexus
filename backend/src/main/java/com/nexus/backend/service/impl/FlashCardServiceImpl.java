package com.nexus.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nexus.backend.dto.request.FlashCardRequest;
import com.nexus.backend.dto.response.FlashCardResponse;
import com.nexus.backend.dto.response.QAPairs;
import com.nexus.backend.entity.FlashCard;
import com.nexus.backend.entity.Plan;
import com.nexus.backend.entity.User;
import com.nexus.backend.exception.AiGenerationException;
import com.nexus.backend.exception.InvalidFileException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.exception.UnauthorizedAccessException;
import com.nexus.backend.repository.FlashCardRepository;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.service.AiService;
import com.nexus.backend.service.FlashCardService;
import com.nexus.backend.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * FlashCardServiceImpl
 */
@Service
@RequiredArgsConstructor
public class FlashCardServiceImpl implements FlashCardService {
    private final FlashCardRepository flashCardRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AiService aiService;

    @Override
    public FlashCardResponse createFlashCard(Long userId, FlashCardRequest request) {
        User user = userService.getUserById(userId);

        String deckId = (request.deckId() != null && !request.deckId().isBlank())
                ? request.deckId()
                : java.util.UUID.randomUUID().toString();
        String deckTitle = (request.deckTitle() != null && !request.deckTitle().isBlank())
                ? request.deckTitle()
                : "General";

        FlashCard flashCard = FlashCard.builder()
                .user(user)
                .deckId(deckId)
                .deckTitle(deckTitle)
                .question(request.question())
                .answer(request.answer())
                .build();

        FlashCard saved = flashCardRepository.save(flashCard);
        return mapToResponse(saved);
    }

    @Override
    public Page<FlashCardResponse> getAllFlashCards(Long userId, Pageable pageable) {
        return flashCardRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public FlashCardResponse getFlashCardById(Long userId, Long flashcardId) {
        FlashCard flashcard = flashCardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id: " + flashcardId));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't own this flashcard.");
        }

        return mapToResponse(flashcard);
    }

    @Override
    public FlashCardResponse updateFlashCard(Long userId, Long flashcardId, FlashCardRequest request) {
        FlashCard flashcard = flashCardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id: " + flashcardId));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't own this flashcard.");
        }

        if (request.question() != null && !request.question().isBlank()) {
            flashcard.setQuestion(request.question());
        }
        if (request.answer() != null && !request.answer().isBlank()) {
            flashcard.setAnswer(request.answer());
        }
        if (request.deckTitle() != null && !request.deckTitle().isBlank()) {
            flashcard.setDeckTitle(request.deckTitle());
        }
        if (request.deckId() != null && !request.deckId().isBlank()) {
            flashcard.setDeckId(request.deckId());
        }

        FlashCard updated = flashCardRepository.save(flashcard);
        return mapToResponse(updated);
    }

    @Override
    public void deleteFlashCard(Long userId, Long flashcardId) {
        delete(flashcardId, userId);
    }

    @Override
    public List<FlashCard> getByUser(Long userId) {
        return flashCardRepository.findByUserId(userId);
    }

    @Override
    public void delete(Long flashcardId, Long userId) {
        FlashCard flashcard = flashCardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found."));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't own this flashcard.");
        }

        flashCardRepository.delete(flashcard);
    }

    @Override
    public List<FlashCardResponse> generate(Long userId, String pdfText, String deckTitle) {
        User user = userService.getUserById(userId);
        userService.resetCreditsIfNewDay(user);
        userService.checkCredits(user);

        if (pdfText == null || pdfText.isBlank()) {
            throw new InvalidFileException("No extractable text found in this PDF.");
        }

        List<QAPairs> pairs = aiService.generateFlashCards(pdfText);

        if (pairs == null || pairs.isEmpty()) {
            throw new AiGenerationException("AI did not return any flashcards. Please try again.");
        }

        String deckId = java.util.UUID.randomUUID().toString();
        List<FlashCard> flashcards = mapToEntities(user, pairs, deckTitle, deckId);
        List<FlashCard> saved = flashCardRepository.saveAll(flashcards);

        decrementCreditsIfNeeded(user);

        return mapToResponses(saved);
    }

    private List<FlashCard> mapToEntities(User user, List<QAPairs> pairs, String deckTitle, String deckId) {
        LocalDateTime now = LocalDateTime.now();

        return pairs.stream()
                .map(pair -> {
                    FlashCard fc = new FlashCard();
                    fc.setUser(user);
                    fc.setDeckId(deckId);
                    fc.setDeckTitle(deckTitle);
                    fc.setQuestion(pair.question());
                    fc.setAnswer(pair.answer());
                    fc.setCreatedAt(now);
                    return fc;
                })
                .toList();
    }

    private void decrementCreditsIfNeeded(User user) {
        if (user.getPlan() != Plan.PREMIUM) {
            user.setCredits(user.getCredits() - 1);
            userRepository.save(user);
        }
    }

    private FlashCardResponse mapToResponse(FlashCard card) {
        return new FlashCardResponse(
                card.getId(),
                card.getDeckId(),
                card.getDeckTitle(),
                card.getQuestion(),
                card.getAnswer(),
                card.getCreatedAt());
    }

    private List<FlashCardResponse> mapToResponses(List<FlashCard> flashCards) {
        return flashCards.stream()
                .map(this::mapToResponse)
                .toList();
    }

}

