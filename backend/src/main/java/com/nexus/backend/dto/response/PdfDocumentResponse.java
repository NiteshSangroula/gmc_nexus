package com.nexus.backend.dto.response;

import java.time.LocalDateTime;

public record PdfDocumentResponse(
        Long id,
        String filename,
        String extractedTextPreview,
        LocalDateTime uploadedAt
){ }
