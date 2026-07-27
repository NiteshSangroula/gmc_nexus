package com.nexus.backend.repository;

import com.nexus.backend.entity.DeckReply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeckReplyRepository extends JpaRepository<DeckReply, Long> {
    List<DeckReply> findByDeckIdOrderByCreatedAtAsc(String deckId);
    long countByDeckId(String deckId);
}
