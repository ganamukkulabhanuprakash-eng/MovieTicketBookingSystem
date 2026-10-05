package com.cinevault.service;

import com.cinevault.dto.BookingRequest;
import com.cinevault.dto.BookingResponse;
import com.cinevault.entity.*;
import com.cinevault.entity.enums.BookingStatus;
import com.cinevault.entity.enums.PaymentStatus;
import com.cinevault.entity.enums.SeatCategory;
import com.cinevault.entity.enums.UserRole;
import com.cinevault.exception.InvalidBookingException;
import com.cinevault.exception.SeatAlreadyBookedException;
import com.cinevault.repository.*;
import com.cinevault.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookingServiceImplTest {

    private BookingRepository bookingRepository;
    private BookingSeatRepository bookingSeatRepository;
    private ShowRepository showRepository;
    private SeatRepository seatRepository;
    private UserRepository userRepository;
    private BookingServiceImpl bookingService;

    private User testUser;
    private Movie testMovie;
    private Theatre testTheatre;
    private Screen testScreen;
    private Show testShow;
    private Seat seatA1;
    private Seat seatA2;

    @BeforeEach
    void setUp() {
        bookingRepository = mock(BookingRepository.class);
        bookingSeatRepository = mock(BookingSeatRepository.class);
        showRepository = mock(ShowRepository.class);
        seatRepository = mock(SeatRepository.class);
        userRepository = mock(UserRepository.class);

        bookingService = new BookingServiceImpl(
                bookingRepository,
                bookingSeatRepository,
                showRepository,
                seatRepository,
                userRepository
        );

        testUser = new User("Bhanu", "bhanu@gmail.com", "pass123", UserRole.USER);
        testUser.setId(1L);

        testMovie = new Movie("Kalki 2898 AD", "Sci-Fi", 180, "Telugu");
        testMovie.setId(10L);

        testTheatre = new Theatre("Prasads Multiplex", "Necklace Road");
        testTheatre.setId(20L);

        testScreen = new Screen("Screen 1", "IMAX", 100, testTheatre);
        testScreen.setId(30L);

        testShow = new Show(testMovie, testScreen, LocalDate.now().plusDays(1), LocalTime.of(18, 0), BigDecimal.valueOf(200.00));
        testShow.setId(40L);

        seatA1 = new Seat("A", 1, SeatCategory.REGULAR, testScreen);
        seatA1.setId(101L);

        seatA2 = new Seat("A", 2, SeatCategory.PREMIUM, testScreen);
        seatA2.setId(102L);
    }

    @Test
    void shouldCreateBookingWithCalculatedPriceAndConvenienceFee() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(showRepository.findById(40L)).thenReturn(Optional.of(testShow));
        when(seatRepository.findByScreenIdOrderByRowLabelAscSeatNumberAsc(30L))
                .thenReturn(List.of(seatA1, seatA2));
        when(bookingSeatRepository.findBookedSeatIdsByShowId(40L))
                .thenReturn(Collections.emptyList());

        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(500L);
            return b;
        });

        BookingRequest request = new BookingRequest(40L, List.of("A1", "A2"));
        BookingResponse response = bookingService.createBooking(1L, request);

        assertNotNull(response);
        assertNotNull(response.getBookingNumber());
        assertEquals("Kalki 2898 AD", response.getMovieTitle());
        assertEquals("Prasads Multiplex", response.getTheatreName());
        assertEquals(2, response.getSeatCount());
        assertTrue(response.getSeats().contains("A1"));
        assertTrue(response.getSeats().contains("A2"));

        // Regular (200) + Premium (300) = 500 ticketAmount
        // Convenience fee = 30 * 2 = 60
        // Total = 560
        assertEquals(0, BigDecimal.valueOf(500.00).compareTo(response.getTicketAmount()));
        assertEquals(0, BigDecimal.valueOf(60.00).compareTo(response.getConvenienceFee()));
        assertEquals(0, BigDecimal.valueOf(560.00).compareTo(response.getTotalAmount()));
        assertEquals("CONFIRMED", response.getStatus());

        verify(bookingRepository).save(any(Booking.class));
        verify(bookingSeatRepository, times(2)).save(any(BookingSeat.class));
    }

    @Test
    void shouldRejectBookingWhenSeatAlreadyBooked() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(showRepository.findById(40L)).thenReturn(Optional.of(testShow));
        when(seatRepository.findByScreenIdOrderByRowLabelAscSeatNumberAsc(30L))
                .thenReturn(List.of(seatA1, seatA2));
        // Seat A1 is already booked!
        when(bookingSeatRepository.findBookedSeatIdsByShowId(40L))
                .thenReturn(List.of(101L));

        BookingRequest request = new BookingRequest(40L, List.of("A1", "A2"));

        assertThrows(SeatAlreadyBookedException.class, () ->
                bookingService.createBooking(1L, request));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void shouldRejectEmptySeatSelection() {
        BookingRequest request = new BookingRequest(40L, Collections.emptyList());

        assertThrows(InvalidBookingException.class, () ->
                bookingService.createBooking(1L, request));
    }

    @Test
    void shouldReturnUserBookings() {
        Booking booking = new Booking("BKG-12345", testUser, testShow, BigDecimal.valueOf(560.00));
        booking.setId(99L);
        booking.setConvenienceFee(BigDecimal.valueOf(60.00));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.SUCCESS);

        when(bookingRepository.findByUserId(1L)).thenReturn(List.of(booking));

        List<BookingResponse> bookings = bookingService.getUserBookings(1L);

        assertEquals(1, bookings.size());
        assertEquals("BKG-12345", bookings.get(0).getBookingNumber());
    }
}
