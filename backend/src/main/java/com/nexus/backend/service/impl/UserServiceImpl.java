package com.nexus.backend.service.impl;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.nexus.backend.dto.response.CreditResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.Plan;
import com.nexus.backend.entity.User;
import com.nexus.backend.exception.InsufficientCreditException;
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

    public void checkCredits(User user) {
        if (user.getPlan() == Plan.PREMIUM)
            return;

        if (user.getCredits() <= 0) {
            throw new InsufficientCreditException("No credits remaining. Try again tomorrow or upgrade to Premium");
        }
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + "doesn't exist"));
    }
}
