package com.nexus.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface PdfService {
    String extractText(MultipartFile file);
}
