package com.cinevault.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for admin creating or editing a screen.
 */
public class ScreenRequest {

    @NotBlank(message = "Screen name is required")
    private String name;

    private String screenType; // Standard, IMAX, Dolby Atmos, 4DX, 3D

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Must have at least 1 seat")
    private Integer totalSeats;

    @NotNull(message = "Theatre ID is required")
    private Long theatreId;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Long getTheatreId() { return theatreId; }
    public void setTheatreId(Long theatreId) { this.theatreId = theatreId; }
}
