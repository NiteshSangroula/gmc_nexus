package com.nexus.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.FlashCardResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.PdfDocument;
import com.nexus.backend.service.FlashCardService;
import com.nexus.backend.service.PdfService;
import com.nexus.backend.service.UserService;

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

}
