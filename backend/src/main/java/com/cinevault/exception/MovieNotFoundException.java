package com.cinevault.exception;

public class MovieNotFoundException extends ResourceNotFoundException {
    public MovieNotFoundException(Long id) {
        super("Movie", "id", id);
    }

    public MovieNotFoundException(String fieldName, Object fieldValue) {
        super("Movie", fieldName, fieldValue);
    }
}
