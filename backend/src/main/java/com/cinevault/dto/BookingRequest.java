package com.cinevault.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookingRequest {

    @NotNull(message = "Show ID is required")
    private Long showId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seatLabels; // e.g. ["A1", "A2"]

    public BookingRequest() {}

    public BookingRequest(Long showId, List<String> seatLabels) {
        this.showId = showId;
        this.seatLabels = seatLabels;
    }

    public Long getShowId() { return showId; }
    public void setShowId(Long showId) { this.showId = showId; }

    public List<String> getSeatLabels() { return seatLabels; }
    public void setSeatLabels(List<String> seatLabels) { this.seatLabels = seatLabels; }

    public List<String> getSeats() { return seatLabels; }
    public void setSeats(List<String> seats) {
        if (this.seatLabels == null || this.seatLabels.isEmpty()) {
            this.seatLabels = seats;
        }
    }
}
