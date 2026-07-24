package com.nexus.backend.service.impl;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.nexus.backend.dto.response.CreditResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.User;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * UserServiceImpl
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserResponse getCurrentUser(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getPlan(),
                user.getCredits());
    }

    public CreditResponse getUserCredit(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        resetCreditsIfNewDay(user);
        return new CreditResponse(
                user.getCredits(),
                user.getPlan());
    }

    public void resetCreditsIfNewDay(User user) {
        if (!user.getLastReset().isEqual(LocalDate.now())) {
            user.setCredits(3);
            user.setLastReset(LocalDate.now());
            userRepository.save(user);
        }

    }
}
