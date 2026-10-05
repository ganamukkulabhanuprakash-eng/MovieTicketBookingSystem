package com.cinevault.service;

import com.cinevault.dto.admin.*;

import java.util.List;

/**
 * Admin service interface covering all admin CRUD operations.
 * Demonstrates: Interface, Abstraction, Generics.
 */
public interface AdminService {

    // Dashboard
    AdminDashboardStats getDashboardStats();

    // Movie management
    List<AdminMovieResponse> getAllMoviesForAdmin(String search);
    AdminMovieResponse getMovieByIdForAdmin(Long id);
    AdminMovieResponse createMovie(MovieRequest request);
    AdminMovieResponse updateMovie(Long id, MovieRequest request);
    void deactivateMovie(Long id);
    void activateMovie(Long id);

    // Theatre management
    List<AdminTheatreResponse> getAllTheatresForAdmin(String search);
    AdminTheatreResponse getTheatreByIdForAdmin(Long id);
    AdminTheatreResponse createTheatre(TheatreRequest request);
    AdminTheatreResponse updateTheatre(Long id, TheatreRequest request);
    void deactivateTheatre(Long id);
    void activateTheatre(Long id);

    // Screen management
    List<AdminScreenResponse> getScreensForAdmin(Long theatreId);
    AdminScreenResponse getScreenByIdForAdmin(Long id);
    AdminScreenResponse createScreen(ScreenRequest request);
    AdminScreenResponse updateScreen(Long id, ScreenRequest request);
    void deactivateScreen(Long id);

    // Show management
    List<AdminShowResponse> getShowsForAdmin(Long movieId, Long theatreId, String date);
    AdminShowResponse getShowByIdForAdmin(Long id);
    AdminShowResponse createShow(ShowRequest request);
    AdminShowResponse updateShow(Long id, ShowRequest request);
    AdminShowResponse updateShowPrice(Long id, java.math.BigDecimal basePrice);
    void deactivateShow(Long id);

    // Bookings (read-only)
    List<AdminBookingResponse> getAllBookings();
}
