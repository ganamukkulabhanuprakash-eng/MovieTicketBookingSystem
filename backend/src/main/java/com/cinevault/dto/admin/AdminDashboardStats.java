package com.cinevault.dto.admin;

import java.math.BigDecimal;

/**
 * Overview/stats response for admin dashboard home page.
 */
public class AdminDashboardStats {
    private long totalMovies;
    private long activeMovies;
    private long totalTheatres;
    private long activeTheatres;
    private long totalScreens;
    private long totalShows;
    private long activeShows;
    private long totalBookings;
    private BigDecimal totalRevenue;

    // Getters and Setters
    public long getTotalMovies() { return totalMovies; }
    public void setTotalMovies(long totalMovies) { this.totalMovies = totalMovies; }

    public long getActiveMovies() { return activeMovies; }
    public void setActiveMovies(long activeMovies) { this.activeMovies = activeMovies; }

    public long getTotalTheatres() { return totalTheatres; }
    public void setTotalTheatres(long totalTheatres) { this.totalTheatres = totalTheatres; }

    public long getActiveTheatres() { return activeTheatres; }
    public void setActiveTheatres(long activeTheatres) { this.activeTheatres = activeTheatres; }

    public long getTotalScreens() { return totalScreens; }
    public void setTotalScreens(long totalScreens) { this.totalScreens = totalScreens; }

    public long getTotalShows() { return totalShows; }
    public void setTotalShows(long totalShows) { this.totalShows = totalShows; }

    public long getActiveShows() { return activeShows; }
    public void setActiveShows(long activeShows) { this.activeShows = activeShows; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
