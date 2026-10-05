package com.cinevault.controller;

import com.cinevault.dto.BookingRequest;
import com.cinevault.dto.BookingResponse;
import com.cinevault.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a ticket booking for the given show and selected seats.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                         Authentication authentication) {
        Long userId = extractUserId(authentication);
        BookingResponse response = bookingService.createBooking(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Retrieve all previous bookings for the currently logged-in customer.
     */
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<BookingResponse> list = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Retrieve details for a specific booking by its human-readable booking number.
     */
    @GetMapping("/{bookingNumber}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String bookingNumber) {
        return ResponseEntity.ok(bookingService.getBookingByNumber(bookingNumber));
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication != null && authentication.getCredentials() instanceof Long) {
            return (Long) authentication.getCredentials();
        }
        return null;
    }
}
