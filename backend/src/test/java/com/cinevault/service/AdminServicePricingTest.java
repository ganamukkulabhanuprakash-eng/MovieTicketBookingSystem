package com.cinevault.service;

import com.cinevault.dto.admin.AdminShowResponse;
import com.cinevault.entity.*;
import com.cinevault.entity.enums.SeatCategory;
import com.cinevault.exception.EntityNotFoundException;
import com.cinevault.repository.*;
import com.cinevault.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AdminServicePricingTest {

    private ShowRepository showRepository;
    private AdminServiceImpl adminService;

    @BeforeEach
    void setUp() {
        MovieRepository movieRepository = mock(MovieRepository.class);
        TheatreRepository theatreRepository = mock(TheatreRepository.class);
        ScreenRepository screenRepository = mock(ScreenRepository.class);
        SeatRepository seatRepository = mock(SeatRepository.class);
        showRepository = mock(ShowRepository.class);
        BookingRepository bookingRepository = mock(BookingRepository.class);

        adminService = new AdminServiceImpl(
                movieRepository,
                theatreRepository,
                screenRepository,
                seatRepository,
                showRepository,
                bookingRepository
        );
    }

    @Test
    void shouldCalculateCategoryMultipliersCorrectly() {
        Movie movie = new Movie("Inception", "Sci-Fi", 148, "English");
        Theatre theatre = new Theatre("PVR INOX", "Gachibowli");
        Screen screen = new Screen("Screen 1", "IMAX", 120, theatre);
        Show show = new Show(movie, screen, LocalDate.now(), LocalTime.of(18, 0), BigDecimal.valueOf(200.00));

        // Test Category Multipliers from domain model
        assertEquals(0, BigDecimal.valueOf(200.0).compareTo(show.getPriceForCategory(SeatCategory.REGULAR)));
        assertEquals(0, BigDecimal.valueOf(300.0).compareTo(show.getPriceForCategory(SeatCategory.PREMIUM)));
        assertEquals(0, BigDecimal.valueOf(400.0).compareTo(show.getPriceForCategory(SeatCategory.RECLINER)));
    }

    @Test
    void shouldUpdateShowPriceSuccessfully() {
        Movie movie = new Movie("Interstellar", "Sci-Fi", 169, "English");
        movie.setId(10L);
        Theatre theatre = new Theatre("Prasads IMAX", "Necklace Road");
        theatre.setId(20L);
        Screen screen = new Screen("Large Screen", "IMAX", 250, theatre);
        screen.setId(30L);

        Show show = new Show(movie, screen, LocalDate.now(), LocalTime.of(19, 30), BigDecimal.valueOf(250.00));
        show.setId(50L);

        when(showRepository.findById(50L)).thenReturn(Optional.of(show));
        when(showRepository.save(any(Show.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminShowResponse updated = adminService.updateShowPrice(50L, BigDecimal.valueOf(350.00));

        assertNotNull(updated);
        assertEquals(BigDecimal.valueOf(350.00), updated.getBasePrice());
        verify(showRepository).save(show);
    }

    @Test
    void shouldRejectInvalidPrice() {
        assertThrows(IllegalArgumentException.class, () ->
                adminService.updateShowPrice(1L, BigDecimal.ZERO));
        assertThrows(IllegalArgumentException.class, () ->
                adminService.updateShowPrice(1L, BigDecimal.valueOf(-50)));
        assertThrows(IllegalArgumentException.class, () ->
                adminService.updateShowPrice(1L, null));
    }

    @Test
    void shouldThrowEntityNotFoundForMissingShow() {
        when(showRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                adminService.updateShowPrice(999L, BigDecimal.valueOf(200)));
    }
}
