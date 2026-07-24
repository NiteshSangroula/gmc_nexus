package com.nexus.backend.service.impl;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.response.CreditResponse;
import com.nexus.backend.dto.response.UpdateProfileResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.Plan;
import com.nexus.backend.entity.User;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.InsufficientCreditException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.security.JwtUtil;
import com.nexus.backend.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * UserServiceImpl
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserResponse getCurrentUser(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
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
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " doesn't exist"));
    }

    public UserResponse upgradeToPremium(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPlan(Plan.PREMIUM);
        userRepository.save(user);
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPlan(),
                user.getCredits());
    }
    
    @Override
    @org.springframework.transaction.annotation.Transactional
    public UpdateProfileResponse updateProfile(Authentication auth, UpdateProfileRequest request) {
        String currentEmail = auth.getName();
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        user.setUsername(request.username());

        String newToken = null;
        if (!user.getEmail().equalsIgnoreCase(request.email())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new DuplicateResourceException("Email already registered by another account.");
            }
            user.setEmail(request.email());
            newToken = jwtUtil.generateToken(request.email());
        }

        userRepository.save(user);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPlan(),
                user.getCredits());

        return new UpdateProfileResponse(userResponse, newToken);
    }
}
