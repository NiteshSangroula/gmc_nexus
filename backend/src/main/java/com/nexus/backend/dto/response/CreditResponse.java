package com.nexus.backend.dto.response;

import com.nexus.backend.entity.Plan;

/**
 * CreditResponse
 */
public record CreditResponse(
        int credits,
        Plan plan) {
}
