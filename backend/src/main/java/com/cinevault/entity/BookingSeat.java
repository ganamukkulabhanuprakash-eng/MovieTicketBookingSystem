package com.cinevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Represents a single seat within a booking.
 * This join table ensures show-specific seat availability.
 * A unique constraint on (show_id, seat_id) prevents double-booking.
 */
@Entity
@Table(name = "booking_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"show_id", "seat_id"})
})
public class BookingSeat extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @NotNull
    @Column(name = "seat_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal seatPrice; // Actual price paid for this seat

    // Constructors
    public BookingSeat() { super(); }

    public BookingSeat(Booking booking, Seat seat, Show show, BigDecimal seatPrice) {
        this();
        this.booking = booking;
        this.seat = seat;
        this.show = show;
        this.seatPrice = seatPrice;
    }

    // Getters and Setters
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }

    public Show getShow() { return show; }
    public void setShow(Show show) { this.show = show; }

    public BigDecimal getSeatPrice() { return seatPrice; }
    public void setSeatPrice(BigDecimal seatPrice) { this.seatPrice = seatPrice; }

    @Override
    public String toString() {
        return "BookingSeat{seatId=" + (seat != null ? seat.getId() : null) + ", price=" + seatPrice + "}";
    }
}
