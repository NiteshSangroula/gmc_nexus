package com.nexus.backend.controller;

import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.entity.Notification;
import com.nexus.backend.entity.User;
import com.nexus.backend.repository.NotificationRepository;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Notifications retrieved"));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> list = notificationRepository.findByUserIdAndUnread(user.getId(), true);
        for (Notification n : list) {
            n.setUnread(false);
        }
        notificationRepository.saveAll(list);
        return ResponseEntity.ok(ApiResponse.success(null, "Notifications marked as read"));
    }
}
