package com.cinevault.exception;

import java.util.List;

public class SeatAlreadyBookedException extends RuntimeException {

    private final List<String> bookedSeatLabels;

    public SeatAlreadyBookedException(List<String> bookedSeatLabels) {
        super("The following seats are already booked: " + String.join(", ", bookedSeatLabels));
        this.bookedSeatLabels = bookedSeatLabels;
    }

    public List<String> getBookedSeatLabels() {
        return bookedSeatLabels;
    }
}
