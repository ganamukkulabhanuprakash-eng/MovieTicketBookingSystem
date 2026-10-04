package com.cinevault.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO matching the frontend's expected show structure.
 * Frontend expects: id, movieId, theatreId, date, time, price, screenType
 */
public class ShowResponse {
    private Long id;
    private Long movieId;
    private Long theatreId;
    private LocalDate date;
    private String time; // Formatted like "10:30 AM"
    private BigDecimal price;
    private String screenType;

    public ShowResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Long getTheatreId() { return theatreId; }
    public void setTheatreId(Long theatreId) { this.theatreId = theatreId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }
}
