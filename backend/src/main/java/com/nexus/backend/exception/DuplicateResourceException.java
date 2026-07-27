package com.nexus.backend.exception;

/**
 * DuplicateResourceException
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }

}
