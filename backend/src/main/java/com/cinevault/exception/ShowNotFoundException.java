package com.cinevault.exception;

public class ShowNotFoundException extends ResourceNotFoundException {
    public ShowNotFoundException(Long id) {
        super("Show", "id", id);
    }
}
