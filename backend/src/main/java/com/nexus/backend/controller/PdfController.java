package com.nexus.backend.controller;

import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.PdfDocumentResponse;
import com.nexus.backend.entity.PdfDocument;
import com.nexus.backend.entity.User;
import com.nexus.backend.repository.PdfDocumentRepository;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.repository.FlashCardRepository;
import com.nexus.backend.service.PdfService;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {
    private final PdfService pdfService;
    private final PdfDocumentRepository pdfDocumentRepository;
    private final UserRepository userRepository;
    private final FlashCardRepository flashCardRepository;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<PdfDocumentResponse>> uploadPdf(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated User not found"));

        String extractedText = pdfService.extractText(file);

        String filename = file.getOriginalFilename();
        String filepath = "/uploads" + UUID.randomUUID().toString() + "_" + filename; // placeholder

        PdfDocument pdfDocument = PdfDocument.builder()
                .user(user)
                .filename(filename)
                .filepath(filepath)
                .extractedText(extractedText)
                .build();
        PdfDocument saveedDoc = pdfDocumentRepository.save(pdfDocument);

        String preview = extractedText.substring(0, Math.min(extractedText.length(), 500));
        PdfDocumentResponse responseData = new PdfDocumentResponse(
                saveedDoc.getId(),
                saveedDoc.getFilename(),
                preview,
                saveedDoc.getUploadedAt()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseData, "PDF uploaded and successfully parsed"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PdfDocumentResponse>>> listPdfs(
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated User not found"));

        List<PdfDocument> pdfs = pdfDocumentRepository.findByUser(user);

        List<PdfDocumentResponse> responseData = pdfs.stream()
                .map(doc -> {
                    String preview = doc.getExtractedText() != null
                            ? doc.getExtractedText().substring(0, Math.min(doc.getExtractedText().length(), 100))
                            : "";
                    return new PdfDocumentResponse(
                            doc.getId(),
                            doc.getFilename(),
                            preview,
                            doc.getUploadedAt()
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(responseData, "PDF list retrieved successfully."));
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Void>> deletePdf(
            @PathVariable Long id,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated User not found"));

        PdfDocument doc = pdfDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PDF not found"));

        if (!doc.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not own this PDF");
        }

        // Purge associated flashcards
        flashCardRepository.deleteByUserAndDeckTitle(user, doc.getFilename());

        // Delete document from DB
        pdfDocumentRepository.delete(doc);

        return ResponseEntity.ok(ApiResponse.success(null, "PDF and associated decks deleted successfully"));
    }
}
