package com.nexus.backend.dto.response;

import com.nexus.backend.entity.Plan;

/**
 * UserResponse
 */
public record UserResponse(
        Long id,
        String email,
        String username,
        Plan plan,
        int credits) {
}
