package com.nexus.backend.service;

import com.nexus.backend.entity.Notification;
import com.nexus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public void createNotification(Long userId, String title, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .unread(true)
                .build();
        notificationRepository.save(notification);
    }
}
