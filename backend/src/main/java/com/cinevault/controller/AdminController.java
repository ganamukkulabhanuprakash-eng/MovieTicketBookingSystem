package com.cinevault.controller;

import com.cinevault.dto.admin.*;
import com.cinevault.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Admin REST controller — all endpoints require ROLE_ADMIN.
 * Protected via Spring Security + @PreAuthorize.
 * Thin controller: business logic lives in AdminService.
 *
 * Demonstrates: REST controllers, constructor injection, thin controller pattern,
 * method overloading (multiple mappings for same resource with different params).
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ── Dashboard ───────────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ── Movie Management ────────────────────────────────────────────
    @GetMapping("/movies")
    public ResponseEntity<List<AdminMovieResponse>> getAllMovies(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllMoviesForAdmin(search));
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<AdminMovieResponse> getMovie(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getMovieByIdForAdmin(id));
    }

    @PostMapping("/movies")
    public ResponseEntity<AdminMovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        AdminMovieResponse created = adminService.createMovie(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<AdminMovieResponse> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(adminService.updateMovie(id, request));
    }

    @PatchMapping("/movies/{id}/deactivate")
    public ResponseEntity<Void> deactivateMovie(@PathVariable Long id) {
        adminService.deactivateMovie(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/movies/{id}/activate")
    public ResponseEntity<Void> activateMovie(@PathVariable Long id) {
        adminService.activateMovie(id);
        return ResponseEntity.noContent().build();
    }

    // ── Theatre Management ──────────────────────────────────────────
    @GetMapping("/theatres")
    public ResponseEntity<List<AdminTheatreResponse>> getAllTheatres(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllTheatresForAdmin(search));
    }

    @GetMapping("/theatres/{id}")
    public ResponseEntity<AdminTheatreResponse> getTheatre(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getTheatreByIdForAdmin(id));
    }

    @PostMapping("/theatres")
    public ResponseEntity<AdminTheatreResponse> createTheatre(@Valid @RequestBody TheatreRequest request) {
        AdminTheatreResponse created = adminService.createTheatre(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/theatres/{id}")
    public ResponseEntity<AdminTheatreResponse> updateTheatre(
            @PathVariable Long id,
            @Valid @RequestBody TheatreRequest request) {
        return ResponseEntity.ok(adminService.updateTheatre(id, request));
    }

    @PatchMapping("/theatres/{id}/deactivate")
    public ResponseEntity<Void> deactivateTheatre(@PathVariable Long id) {
        adminService.deactivateTheatre(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/theatres/{id}/activate")
    public ResponseEntity<Void> activateTheatre(@PathVariable Long id) {
        adminService.activateTheatre(id);
        return ResponseEntity.noContent().build();
    }

    // ── Screen Management ───────────────────────────────────────────
    @GetMapping("/screens")
    public ResponseEntity<List<AdminScreenResponse>> getScreens(
            @RequestParam(required = false) Long theatreId) {
        return ResponseEntity.ok(adminService.getScreensForAdmin(theatreId));
    }

    @GetMapping("/screens/{id}")
    public ResponseEntity<AdminScreenResponse> getScreen(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getScreenByIdForAdmin(id));
    }

    @PostMapping("/screens")
    public ResponseEntity<AdminScreenResponse> createScreen(@Valid @RequestBody ScreenRequest request) {
        AdminScreenResponse created = adminService.createScreen(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/screens/{id}")
    public ResponseEntity<AdminScreenResponse> updateScreen(
            @PathVariable Long id,
            @Valid @RequestBody ScreenRequest request) {
        return ResponseEntity.ok(adminService.updateScreen(id, request));
    }

    @PatchMapping("/screens/{id}/deactivate")
    public ResponseEntity<Void> deactivateScreen(@PathVariable Long id) {
        adminService.deactivateScreen(id);
        return ResponseEntity.noContent().build();
    }

    // ── Show Management ─────────────────────────────────────────────
    @GetMapping("/shows")
    public ResponseEntity<List<AdminShowResponse>> getShows(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theatreId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(adminService.getShowsForAdmin(movieId, theatreId, date));
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<AdminShowResponse> getShow(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getShowByIdForAdmin(id));
    }

    @PostMapping("/shows")
    public ResponseEntity<AdminShowResponse> createShow(@Valid @RequestBody ShowRequest request) {
        AdminShowResponse created = adminService.createShow(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<AdminShowResponse> updateShow(
            @PathVariable Long id,
            @Valid @RequestBody ShowRequest request) {
        return ResponseEntity.ok(adminService.updateShow(id, request));
    }

    @PatchMapping("/shows/{id}/pricing")
    public ResponseEntity<AdminShowResponse> updateShowPrice(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal basePrice = request.get("basePrice");
        return ResponseEntity.ok(adminService.updateShowPrice(id, basePrice));
    }

    @PatchMapping("/shows/{id}/deactivate")
    public ResponseEntity<Void> deactivateShow(@PathVariable Long id) {
        adminService.deactivateShow(id);
        return ResponseEntity.noContent().build();
    }

    // ── Bookings (read-only) ────────────────────────────────────────
    @GetMapping("/bookings")
    public ResponseEntity<List<AdminBookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }
}
