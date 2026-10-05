package com.cinevault.dto.admin;

import java.util.List;

/**
 * Admin theatre response including active status and screen count.
 */
public class AdminTheatreResponse {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String city;
    private List<String> facilities;
    private boolean active;
    private int screenCount;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public List<String> getFacilities() { return facilities; }
    public void setFacilities(List<String> facilities) { this.facilities = facilities; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getScreenCount() { return screenCount; }
    public void setScreenCount(int screenCount) { this.screenCount = screenCount; }
}
