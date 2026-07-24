package com.nexus.backend.exception;

/**
 * InsufficientCreditException
 */
public class InsufficientCreditException extends RuntimeException {
    public InsufficientCreditException(String message) {
        super(message);
    }
}
