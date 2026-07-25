package com.nexus.backend.controller;

import com.nexus.backend.dto.request.DeckReplyRequest;
import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.DeckInteractionResponse;
import com.nexus.backend.entity.DeckReaction;
import com.nexus.backend.entity.DeckReply;
import com.nexus.backend.repository.DeckReactionRepository;
import com.nexus.backend.repository.DeckReplyRepository;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.entity.User;
import com.nexus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/decks")
public class DeckInteractionController {

    private final DeckReactionRepository reactionRepository;
    private final DeckReplyRepository replyRepository;
    private final UserRepository userRepository;

    @GetMapping("/{deckId}/interactions")
    public ResponseEntity<ApiResponse<DeckInteractionResponse>> getInteractions(
            @PathVariable String deckId,
            Authentication auth) {
        
        long likes = reactionRepository.countByDeckIdAndLiked(deckId, true);
        long dislikes = reactionRepository.countByDeckIdAndLiked(deckId, false);
        
        String userReaction = "NONE";
        if (auth != null) {
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                Optional<DeckReaction> reactOpt = reactionRepository.findByDeckIdAndUserId(deckId, userOpt.get().getId());
                if (reactOpt.isPresent()) {
                    userReaction = reactOpt.get().isLiked() ? "LIKE" : "DISLIKE";
                }
            }
        }
        
        DeckInteractionResponse response = new DeckInteractionResponse(deckId, likes, dislikes, userReaction);
        return ResponseEntity.ok(ApiResponse.success(response, "Deck interactions retrieved"));
    }

    @PostMapping("/{deckId}/react")
    public ResponseEntity<ApiResponse<DeckInteractionResponse>> reactToDeck(
            @PathVariable String deckId,
            @RequestParam boolean isLike,
            Authentication auth) {
        
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Optional<DeckReaction> existingReaction = reactionRepository.findByDeckIdAndUserId(deckId, user.getId());
        if (existingReaction.isPresent()) {
            DeckReaction reaction = existingReaction.get();
            if (reaction.isLiked() == isLike) {
                reactionRepository.delete(reaction);
            } else {
                reaction.setLiked(isLike);
                reactionRepository.save(reaction);
            }
        } else {
            DeckReaction reaction = DeckReaction.builder()
                    .deckId(deckId)
                    .userId(user.getId())
                    .liked(isLike)
                    .build();
            reactionRepository.save(reaction);
        }

        long likes = reactionRepository.countByDeckIdAndLiked(deckId, true);
        long dislikes = reactionRepository.countByDeckIdAndLiked(deckId, false);
        
        String userReaction = "NONE";
        Optional<DeckReaction> updatedReact = reactionRepository.findByDeckIdAndUserId(deckId, user.getId());
        if (updatedReact.isPresent()) {
            userReaction = updatedReact.get().isLiked() ? "LIKE" : "DISLIKE";
        }

        DeckInteractionResponse response = new DeckInteractionResponse(deckId, likes, dislikes, userReaction);
        return ResponseEntity.ok(ApiResponse.success(response, "Reaction updated successfully"));
    }

    @GetMapping("/{deckId}/replies")
    public ResponseEntity<ApiResponse<List<DeckReply>>> getReplies(@PathVariable String deckId) {
        List<DeckReply> replies = replyRepository.findByDeckIdOrderByCreatedAtAsc(deckId);
        return ResponseEntity.ok(ApiResponse.success(replies, "Replies retrieved successfully"));
    }

    @PostMapping("/{deckId}/replies")
    public ResponseEntity<ApiResponse<DeckReply>> addReply(
            @PathVariable String deckId,
            @Valid @RequestBody DeckReplyRequest request,
            Authentication auth) {
        
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        DeckReply reply = DeckReply.builder()
                .deckId(deckId)
                .userId(user.getId())
                .username(user.getUsername() != null && !user.getUsername().isBlank() ? user.getUsername() : user.getEmail().split("@")[0])
                .message(request.message())
                .createdAt(LocalDateTime.now())
                .build();
        
        DeckReply savedReply = replyRepository.save(reply);
        return ResponseEntity.ok(ApiResponse.success(savedReply, "Reply posted successfully"));
    }
}
