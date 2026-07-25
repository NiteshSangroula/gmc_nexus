package com.nexus.backend.repository;

import com.nexus.backend.entity.DeckReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DeckReactionRepository extends JpaRepository<DeckReaction, Long> {
    Optional<DeckReaction> findByDeckIdAndUserId(String deckId, Long userId);
    long countByDeckIdAndLiked(String deckId, boolean liked);
    List<DeckReaction> findByUserId(Long userId);
}
