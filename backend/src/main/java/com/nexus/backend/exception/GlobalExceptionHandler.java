package com.nexus.backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nexus.backend.dto.response.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;

/**
 * GlobalExceptionHandler
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
    }

    @ExceptionHandler(InsufficientCreditException.class)
    public ResponseEntity<ApiResponse<Void>> handleInsufficientCreditException(
            InsufficientCreditException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(apiResponse);
    }

    @ExceptionHandler(AiGenerationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAiGenerationException(
            AiGenerationException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(apiResponse);
    }

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidFileException(
            InvalidFileException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(apiResponse);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedAccessException(
            UnauthorizedAccessException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResource(
            DuplicateResourceException ex,
            HttpServletRequest request) {
        ApiResponse<Void> apiResponse = ApiResponse.error(
                ex.getMessage(),
                null,
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ApiResponse<Void> apiResponse = ApiResponse.error(
                "Validation Failed", errors, request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler()
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        ApiResponse<Void> apiResponse = ApiResponse.error(
                "something went wrong", null, request.getRequestURI());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

}
