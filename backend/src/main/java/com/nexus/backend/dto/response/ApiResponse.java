package com.nexus.backend.dto.response;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Instant timestamp;
    private Object errors; // List<String> or custom error dto later
    private String path;

    // success factory
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    // error factory
    public static <T> ApiResponse<T> error(String message, Object errors, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }
}
