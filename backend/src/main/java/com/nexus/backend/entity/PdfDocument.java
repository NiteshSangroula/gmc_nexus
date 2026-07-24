package com.nexus.backend.entity;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pdf_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String filepath;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @CreationTimestamp
    private LocalDateTime uploadedAt;

}
