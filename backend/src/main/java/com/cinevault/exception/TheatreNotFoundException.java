package com.cinevault.exception;

public class TheatreNotFoundException extends ResourceNotFoundException {
    public TheatreNotFoundException(Long id) {
        super("Theatre", "id", id);
    }
}
