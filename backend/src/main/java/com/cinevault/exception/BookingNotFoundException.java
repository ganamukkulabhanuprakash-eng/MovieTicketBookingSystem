package com.cinevault.exception;

public class BookingNotFoundException extends ResourceNotFoundException {
    public BookingNotFoundException(Long id) {
        super("Booking", "id", id);
    }

    public BookingNotFoundException(String bookingNumber) {
        super("Booking", "bookingNumber", bookingNumber);
    }
}
