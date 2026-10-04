package com.cinevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shows")
public class Show extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @NotNull
    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @NotNull
    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @NotNull
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice; // Base ticket price for REGULAR category

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    // Constructors
    public Show() { super(); }

    public Show(Movie movie, Screen screen, LocalDate showDate, LocalTime showTime, BigDecimal basePrice) {
        this();
        this.movie = movie;
        this.screen = screen;
        this.showDate = showDate;
        this.showTime = showTime;
        this.basePrice = basePrice;
    }

    /**
     * Calculates the ticket price for a given seat category.
     * Demonstrates method usage with enums.
     */
    public BigDecimal getPriceForCategory(com.cinevault.entity.enums.SeatCategory category) {
        return basePrice.multiply(BigDecimal.valueOf(category.getPriceMultiplier()));
    }

    /**
     * Returns a formatted time string like "10:30 AM".
     */
    public String getFormattedTime() {
        if (showTime == null) return "";
        int hour = showTime.getHour();
        int minute = showTime.getMinute();
        String amPm = hour >= 12 ? "PM" : "AM";
        int displayHour = hour % 12;
        if (displayHour == 0) displayHour = 12;
        return String.format("%d:%02d %s", displayHour, minute, amPm);
    }

    // Getters and Setters
    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public Screen getScreen() { return screen; }
    public void setScreen(Screen screen) { this.screen = screen; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    @Override
    public String toString() {
        return "Show{id=" + getId() + ", date=" + showDate + ", time=" + showTime + ", price=" + basePrice + "}";
    }
}
