package com.cinevault.service;

import com.cinevault.dto.BookingRequest;
import com.cinevault.dto.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(Long userId, BookingRequest request);
    List<BookingResponse> getUserBookings(Long userId);
    BookingResponse getBookingByNumber(String bookingNumber);
}
