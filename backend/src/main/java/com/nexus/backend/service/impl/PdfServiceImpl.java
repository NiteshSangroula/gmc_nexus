package com.nexus.backend.service.impl;


import com.nexus.backend.service.PdfService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfServiceImpl implements PdfService {
    @Override
    public String extractText(MultipartFile file) {
        if(file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");

        }
        try(PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException("PDF contains no readable text.");
            }
            return text;
        } catch (IOException e){
            throw new RuntimeException("Failed to read/parse PDF file: " + e.getMessage(), e);
        }
    }
}
