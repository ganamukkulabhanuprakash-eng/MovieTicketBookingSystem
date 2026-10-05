package com.cinevault.exception;

/**
 * Generic resource not found exception for admin operations.
 * Extends the abstract ResourceNotFoundException base class.
 * Demonstrates: Inheritance, constructor chaining.
 */
public class EntityNotFoundException extends ResourceNotFoundException {

    public EntityNotFoundException(String resourceName, Long id) {
        super(resourceName, "id", id);
    }

    public EntityNotFoundException(String resourceName, String fieldName, Object value) {
        super(resourceName, fieldName, value);
    }
}
