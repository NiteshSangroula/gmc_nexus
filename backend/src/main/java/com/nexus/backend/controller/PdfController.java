package com.nexus.backend.controller;


import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.PdfDocumentResponse;
import com.nexus.backend.entity.PdfDocument;
import com.nexus.backend.entity.User;
import com.nexus.backend.repository.PdfDocumentRepository;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {
    private final PdfService pdfService;
    private final PdfDocumentRepository pdfDocumentRepository;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<PdfDocumentResponse>> uploadPdf(
            @RequestParam("file")MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails){
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated User not found "));

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


}
