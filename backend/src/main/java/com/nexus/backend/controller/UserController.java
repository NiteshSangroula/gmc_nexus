package com.nexus.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexus.backend.dto.response.ApiResponse;
import com.nexus.backend.dto.response.CreditResponse;
import com.nexus.backend.dto.response.UserResponse;
import com.nexus.backend.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * UserController
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> getUser(Authentication auth) {
        UserResponse response = userService.getCurrentUser(auth);
        ApiResponse<UserResponse> apiResponse = ApiResponse.success(response, "user retrived succesfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/credits")
    public ResponseEntity<ApiResponse<CreditResponse>> getCredits(Authentication auth) {
        CreditResponse creditResponse = userService.getUserCredit(auth);
        ApiResponse<CreditResponse> apiResponse = ApiResponse.success(creditResponse,
                "user's credit retrived succesfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/premium")
    public ResponseEntity<ApiResponse<UserResponse>> upgradeToPremium(Authentication auth) {
        UserResponse response = userService.upgradeToPremium(auth);
        ApiResponse<UserResponse> apiResponse = ApiResponse.success(response,
                "User's plan upgraded to premium succesfully.");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<com.nexus.backend.dto.response.UpdateProfileResponse>> updateProfile(
            @jakarta.validation.Valid @RequestBody com.nexus.backend.dto.request.UpdateProfileRequest request,
            Authentication auth) {
        com.nexus.backend.dto.response.UpdateProfileResponse response = userService.updateProfile(auth, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated successfully"));
    }

}
