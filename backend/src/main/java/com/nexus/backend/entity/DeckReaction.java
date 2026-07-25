package com.nexus.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deck_reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"deckId", "userId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeckReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deckId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private boolean liked;
}
