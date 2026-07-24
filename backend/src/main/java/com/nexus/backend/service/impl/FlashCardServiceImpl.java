package com.nexus.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

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

    public List<FlashCard> getByUser(Long userId) {
        return flashCardRepository.findByUserId(userId);
    }

    public void delete(Long flashcardId, Long userId) {
        FlashCard flashcard = flashCardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found."));

        if (!flashcard.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You don't own this flashcard.");
        }

        flashCardRepository.delete(flashcard);
    }

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

        List<FlashCard> flashcards = mapToEntities(userId, pairs, deckTitle);
        List<FlashCard> saved = flashCardRepository.saveAll(flashcards);

        decrementCreditsIfNeeded(user);

        return mapToResponses(saved);
    }

    private List<FlashCard> mapToEntities(Long userId, List<QAPairs> pairs, String deckTitle) {
        LocalDateTime now = LocalDateTime.now();

        return pairs.stream()
                .map(pair -> {
                    FlashCard fc = new FlashCard();
                    fc.getUser().setId(userId);
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

    private List<FlashCardResponse> mapToResponses(List<FlashCard> flashCards) {
        return flashCards.stream()
                .map(card -> new FlashCardResponse(
                        card.getId(),
                        card.getDeckTitle(),
                        card.getQuestion(),
                        card.getAnswer(),
                        card.getCreatedAt()))
                .toList();
    }

}
