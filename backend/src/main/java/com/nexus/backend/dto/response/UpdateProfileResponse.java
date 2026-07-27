package com.nexus.backend.dto.response;

public record UpdateProfileResponse(
        UserResponse user,
        String token
) {
}
