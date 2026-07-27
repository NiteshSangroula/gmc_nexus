package com.nexus.backend.exception;

/**
 * UnauthorizedException
 */
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }

}
