package com.nexus.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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

}
