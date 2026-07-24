package com.nexus.backend.service;

import org.springframework.web.multipart.MultipartFile;

import com.nexus.backend.entity.PdfDocument;

public interface PdfService {
    public String extractText(MultipartFile file);

    public PdfDocument findById(Long id);

}
