package com.nexus.backend.service;

import org.springframework.security.core.Authentication;

import com.nexus.backend.dto.response.CreditResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.entity.User;

/**
 * UserService
 */
public interface UserService {
    public UserResponse getCurrentUser(Authentication auth);

    public CreditResponse getUserCredit(Authentication auth);

    public void resetCreditsIfNewDay(User user);

    public void checkCredits(User user);

    public User getUserById(Long userId);

    public UserResponse upgradeToPremium(Authentication auth);

    public com.nexus.backend.dto.response.UpdateProfileResponse updateProfile(Authentication auth, com.nexus.backend.dto.request.UpdateProfileRequest request);

}
