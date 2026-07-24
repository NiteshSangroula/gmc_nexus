package com.nexus.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nexus.backend.entity.PdfDocument;

@Repository
public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {

}
