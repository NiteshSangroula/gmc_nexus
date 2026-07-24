package com.nexus.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.nexus.backend.entity.FlashCard;
import com.nexus.backend.entity.User;

import java.util.List;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
    List<FlashCard> findByUserAndDeckId(User user, String deckId);

    List<FlashCard> findByUserId(Long userId);

    Page<FlashCard> findByUserId(Long userId, Pageable pageable);

    void deleteByUserAndDeckId(User user, String deckId);

    @Query("SELECT DISTINCT f.deckId, f.deckTitle, f.createdAt FROM FlashCard f WHERE f.user = :user")
    List<Object[]> findDistinctDeckByUser(User user);

}

