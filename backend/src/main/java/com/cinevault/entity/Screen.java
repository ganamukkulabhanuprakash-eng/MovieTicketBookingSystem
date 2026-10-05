package com.cinevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screens", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"theatre_id", "name"})
})
public class Screen extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name; // "Screen 1", "IMAX", "Audi 3"

    @Column(name = "screen_type")
    private String screenType; // Standard, IMAX, Dolby Atmos, 4DX

    @NotNull
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theatre_id", nullable = false)
    private Theatre theatre;

    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();

    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Show> shows = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true;

    // Constructors
    public Screen() { super(); }

    public Screen(String name, String screenType, Integer totalSeats, Theatre theatre) {
        this();
        this.name = name;
        this.screenType = screenType;
        this.totalSeats = totalSeats;
        this.theatre = theatre;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScreenType() { return screenType; }
    public void setScreenType(String screenType) { this.screenType = screenType; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Theatre getTheatre() { return theatre; }
    public void setTheatre(Theatre theatre) { this.theatre = theatre; }

    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }

    public List<Show> getShows() { return shows; }
    public void setShows(List<Show> shows) { this.shows = shows; }

    @Override
    public String toString() {
        return "Screen{id=" + getId() + ", name='" + name + "', type='" + screenType + "'}";
    }
}
