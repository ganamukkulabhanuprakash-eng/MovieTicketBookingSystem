package com.cinevault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theatres")
public class Theatre extends BaseEntity {

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @Size(max = 500)
    private String address;

    @Size(max = 100)
    private String city = "Hyderabad";

    @Column(columnDefinition = "TEXT")
    private String facilities; // Comma-separated: "IMAX,Dolby Atmos,Recliner"

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "theatre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Screen> screens = new ArrayList<>();

    // Constructors
    public Theatre() { super(); }

    public Theatre(String name, String location) {
        this();
        this.name = name;
        this.location = location;
    }

    public Theatre(String name, String location, String address) {
        this(name, location);
        this.address = address;
    }

    // Helper
    public List<String> getFacilitiesList() {
        if (facilities == null || facilities.isBlank()) return List.of();
        return List.of(facilities.split(","));
    }

    public void setFacilitiesFromList(List<String> facilitiesList) {
        this.facilities = String.join(",", facilitiesList);
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<Screen> getScreens() { return screens; }
    public void setScreens(List<Screen> screens) { this.screens = screens; }

    @Override
    public String toString() {
        return "Theatre{id=" + getId() + ", name='" + name + "', location='" + location + "'}";
    }
}
