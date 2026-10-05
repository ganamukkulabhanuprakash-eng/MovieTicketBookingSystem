package com.cinevault.dto.admin;

/**
 * Admin screen response including theatre info and active status.
 */
public class AdminScreenResponse {
    private Long id;
    private String name;
    private String screenType;
    private Integer totalSeats;
    private Long theatreId;
    private String theatreName;
    private boolean active;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Long getTheatreId() { return theatreId; }
    public void setTheatreId(Long theatreId) { this.theatreId = theatreId; }

    public String getTheatreName() { return theatreName; }
    public void setTheatreName(String theatreName) { this.theatreName = theatreName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
