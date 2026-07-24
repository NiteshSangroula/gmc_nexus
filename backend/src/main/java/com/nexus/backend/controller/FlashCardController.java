package com.nexus.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nexus.backend.dto.request.FlashCardRequest;
import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.FlashCardResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.PdfDocument;
import com.nexus.backend.service.FlashCardService;
import com.nexus.backend.service.PdfService;
import com.nexus.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * FlashCardController
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cards")
public class FlashCardController {
    private final FlashCardService flashCardService;
    private final UserService userService;
    private final PdfService pdfService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<FlashCardResponse>>> generate(
            @RequestParam Long pdfId,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        PdfDocument pdfDoc = pdfService.findById(pdfId);
        String pdfText = pdfDoc.getExtractedText();
        String deckTitle = pdfDoc.getFilename();

        List<FlashCardResponse> flashcards = flashCardService.generate(userResponse.id(), pdfText, deckTitle);
        ApiResponse<List<FlashCardResponse>> apiResponse = ApiResponse.success(flashcards,
                "flashcards generated succesfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);

    }

    @PostMapping
    public ResponseEntity<ApiResponse<FlashCardResponse>> createFlashCard(
            @Valid @RequestBody FlashCardRequest request,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        FlashCardResponse createdCard = flashCardService.createFlashCard(userResponse.id(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdCard, "Flashcard created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FlashCardResponse>>> getAllFlashCards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<FlashCardResponse> cardsPage = flashCardService.getAllFlashCards(userResponse.id(), pageable);
        return ResponseEntity.ok(ApiResponse.success(cardsPage, "Flashcards retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashCardResponse>> getFlashCardById(
            @PathVariable Long id,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        FlashCardResponse card = flashCardService.getFlashCardById(userResponse.id(), id);
        return ResponseEntity.ok(ApiResponse.success(card, "Flashcard retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashCardResponse>> updateFlashCard(
            @PathVariable Long id,
            @Valid @RequestBody FlashCardRequest request,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        FlashCardResponse updatedCard = flashCardService.updateFlashCard(userResponse.id(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedCard, "Flashcard updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlashCard(
            @PathVariable Long id,
            Authentication auth) {
        UserResponse userResponse = userService.getCurrentUser(auth);
        flashCardService.deleteFlashCard(userResponse.id(), id);
        return ResponseEntity.ok(ApiResponse.success(null, "Flashcard deleted successfully"));
    }

}
