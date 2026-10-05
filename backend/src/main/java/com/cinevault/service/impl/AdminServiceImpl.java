package com.cinevault.service.impl;

import com.cinevault.dto.admin.*;
import com.cinevault.entity.*;
import com.cinevault.entity.enums.SeatCategory;
import com.cinevault.exception.EntityNotFoundException;
import com.cinevault.repository.*;
import com.cinevault.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin service implementation.
 * Demonstrates: Interface implementation, Polymorphism, Streams, Lambda,
 * Transactions, Collections, Generics, Custom exceptions.
 */
@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public AdminServiceImpl(MovieRepository movieRepository,
                            TheatreRepository theatreRepository,
                            ScreenRepository screenRepository,
                            SeatRepository seatRepository,
                            ShowRepository showRepository,
                            BookingRepository bookingRepository) {
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    // ══════════════════════════════════════════════════════
    // DASHBOARD STATS
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalMovies(movieRepository.count());
        stats.setActiveMovies(movieRepository.countByActiveTrue());
        stats.setTotalTheatres(theatreRepository.count());
        stats.setActiveTheatres(theatreRepository.countByActiveTrue());
        stats.setTotalScreens(screenRepository.count());
        stats.setTotalShows(showRepository.count());
        stats.setActiveShows(showRepository.countByActiveTrue());
        stats.setTotalBookings(bookingRepository.count());
        BigDecimal revenue = showRepository.sumConfirmedRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);
        return stats;
    }

    // ══════════════════════════════════════════════════════
    // MOVIE MANAGEMENT
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public List<AdminMovieResponse> getAllMoviesForAdmin(String search) {
        String searchParam = (search == null || search.isBlank()) ? null : search.trim();
        return movieRepository.findAllForAdmin(searchParam)
                .stream()
                .map(this::mapToAdminMovieResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminMovieResponse getMovieByIdForAdmin(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie", id));
        return mapToAdminMovieResponse(movie);
    }

    @Override
    public AdminMovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie(
                request.getTitle().trim(),
                request.getGenre(),
                request.getDuration(),
                request.getLanguage()
        );
        applyMovieRequest(movie, request);
        Movie saved = movieRepository.save(movie);
        return mapToAdminMovieResponse(saved);
    }

    @Override
    public AdminMovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie", id));
        applyMovieRequest(movie, request);
        Movie saved = movieRepository.save(movie);
        return mapToAdminMovieResponse(saved);
    }

    @Override
    public void deactivateMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie", id));
        movie.setActive(false);
        movieRepository.save(movie);
    }

    @Override
    public void activateMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movie", id));
        movie.setActive(true);
        movieRepository.save(movie);
    }

    private void applyMovieRequest(Movie movie, MovieRequest req) {
        movie.setTitle(req.getTitle().trim());
        movie.setTagline(req.getTagline());
        movie.setDescription(req.getDescription());
        movie.setGenre(req.getGenre());
        movie.setDuration(req.getDuration());
        movie.setRating(req.getRating());
        movie.setReleaseDate(req.getReleaseDate());
        movie.setLanguage(req.getLanguage());
        movie.setCertification(req.getCertification());
        movie.setDirector(req.getDirector());
        movie.setCastMembers(req.getCastMembers());
        movie.setPosterUrl(req.getPosterUrl());
        movie.setBackdropUrl(req.getBackdropUrl());
        movie.setFeatured(req.isFeatured());
        movie.setStatus(req.getStatus() != null ? req.getStatus() : "now_showing");
    }

    private AdminMovieResponse mapToAdminMovieResponse(Movie movie) {
        AdminMovieResponse r = new AdminMovieResponse();
        r.setId(movie.getId());
        r.setTitle(movie.getTitle());
        r.setTagline(movie.getTagline());
        r.setDescription(movie.getDescription());
        r.setGenre(movie.getGenreList());
        r.setDuration(movie.getDuration());
        r.setRating(movie.getRating());
        r.setReleaseDate(movie.getReleaseDate());
        r.setLanguage(movie.getLanguage());
        r.setCertification(movie.getCertification());
        r.setDirector(movie.getDirector());
        r.setCast(movie.getCastList());
        r.setPosterUrl(movie.getPosterUrl());
        r.setBackdropUrl(movie.getBackdropUrl());
        r.setFeatured(movie.isFeatured());
        r.setStatus(movie.getStatus());
        r.setActive(movie.isActive());
        return r;
    }

    // ══════════════════════════════════════════════════════
    // THEATRE MANAGEMENT
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public List<AdminTheatreResponse> getAllTheatresForAdmin(String search) {
        String searchParam = (search == null || search.isBlank()) ? null : search.trim();
        return theatreRepository.findAllForAdmin(searchParam)
                .stream()
                .map(this::mapToAdminTheatreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminTheatreResponse getTheatreByIdForAdmin(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theatre", id));
        return mapToAdminTheatreResponse(theatre);
    }

    @Override
    public AdminTheatreResponse createTheatre(TheatreRequest request) {
        Theatre theatre = new Theatre(request.getName().trim(), request.getLocation().trim());
        applyTheatreRequest(theatre, request);
        Theatre saved = theatreRepository.save(theatre);
        return mapToAdminTheatreResponse(saved);
    }

    @Override
    public AdminTheatreResponse updateTheatre(Long id, TheatreRequest request) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theatre", id));
        applyTheatreRequest(theatre, request);
        Theatre saved = theatreRepository.save(theatre);
        return mapToAdminTheatreResponse(saved);
    }

    @Override
    public void deactivateTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theatre", id));
        theatre.setActive(false);
        theatreRepository.save(theatre);
    }

    @Override
    public void activateTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theatre", id));
        theatre.setActive(true);
        theatreRepository.save(theatre);
    }

    private void applyTheatreRequest(Theatre theatre, TheatreRequest req) {
        theatre.setName(req.getName().trim());
        theatre.setLocation(req.getLocation().trim());
        theatre.setAddress(req.getAddress());
        theatre.setCity(req.getCity() != null ? req.getCity() : "Hyderabad");
        theatre.setFacilities(req.getFacilities());
    }

    private AdminTheatreResponse mapToAdminTheatreResponse(Theatre theatre) {
        AdminTheatreResponse r = new AdminTheatreResponse();
        r.setId(theatre.getId());
        r.setName(theatre.getName());
        r.setLocation(theatre.getLocation());
        r.setAddress(theatre.getAddress());
        r.setCity(theatre.getCity());
        r.setFacilities(theatre.getFacilitiesList());
        r.setActive(theatre.isActive());
        r.setScreenCount(theatre.getScreens().size());
        return r;
    }

    // ══════════════════════════════════════════════════════
    // SCREEN MANAGEMENT
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public List<AdminScreenResponse> getScreensForAdmin(Long theatreId) {
        return screenRepository.findAllForAdmin(theatreId)
                .stream()
                .map(this::mapToAdminScreenResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminScreenResponse getScreenByIdForAdmin(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen", id));
        return mapToAdminScreenResponse(screen);
    }

    @Override
    public AdminScreenResponse createScreen(ScreenRequest request) {
        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new EntityNotFoundException("Theatre", request.getTheatreId()));

        if (!theatre.isActive()) {
            throw new IllegalArgumentException("Cannot add a screen to an inactive theatre.");
        }

        // Check for duplicate screen name within theatre
        if (screenRepository.existsByTheatreIdAndName(theatre.getId(), request.getName().trim())) {
            throw new IllegalArgumentException("A screen named '" + request.getName() + "' already exists in this theatre.");
        }

        Screen screen = new Screen(
                request.getName().trim(),
                request.getScreenType(),
                request.getTotalSeats(),
                theatre
        );

        Screen saved = screenRepository.save(screen);

        // Auto-generate seats for the new screen
        List<Seat> seats = generateSeats(saved, request.getTotalSeats(), request.getScreenType());
        seatRepository.saveAll(seats);

        return mapToAdminScreenResponse(saved);
    }

    @Override
    public AdminScreenResponse updateScreen(Long id, ScreenRequest request) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen", id));

        screen.setName(request.getName().trim());
        screen.setScreenType(request.getScreenType());
        // Note: totalSeats update is complex (would need seat re-generation). Only metadata is updated here.
        Screen saved = screenRepository.save(screen);
        return mapToAdminScreenResponse(saved);
    }

    @Override
    public void deactivateScreen(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen", id));
        screen.setActive(false);
        screenRepository.save(screen);
    }

    /**
     * Generates a standard seat layout for a new screen.
     * Uses rows A-J with REGULAR/PREMIUM/RECLINER categories
     * based on screen type, up to the specified totalSeats count.
     */
    private List<Seat> generateSeats(Screen screen, int totalSeats, String screenType) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"};
        int seatsPerRow = 12;
        int seatCount = 0;

        for (int r = 0; r < rows.length && seatCount < totalSeats; r++) {
            SeatCategory category = determineSeatCategory(r, screenType);
            for (int s = 1; s <= seatsPerRow && seatCount < totalSeats; s++) {
                seats.add(new Seat(rows[r], s, category, screen));
                seatCount++;
            }
        }
        return seats;
    }

    private SeatCategory determineSeatCategory(int rowIndex, String screenType) {
        if (rowIndex < 2 && screenType != null &&
                (screenType.contains("IMAX") || screenType.contains("4DX"))) {
            return SeatCategory.RECLINER;
        } else if (rowIndex < 2) {
            return SeatCategory.PREMIUM;
        }
        return SeatCategory.REGULAR;
    }

    private AdminScreenResponse mapToAdminScreenResponse(Screen screen) {
        AdminScreenResponse r = new AdminScreenResponse();
        r.setId(screen.getId());
        r.setName(screen.getName());
        r.setScreenType(screen.getScreenType());
        r.setTotalSeats(screen.getTotalSeats());
        r.setTheatreId(screen.getTheatre().getId());
        r.setTheatreName(screen.getTheatre().getName());
        r.setActive(screen.isActive());
        return r;
    }

    // ══════════════════════════════════════════════════════
    // SHOW MANAGEMENT
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public List<AdminShowResponse> getShowsForAdmin(Long movieId, Long theatreId, String date) {
        LocalDate showDate = null;
        if (date != null && !date.isBlank()) {
            showDate = LocalDate.parse(date);
        }
        return showRepository.findAllForAdmin(movieId, theatreId, showDate)
                .stream()
                .map(this::mapToAdminShowResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminShowResponse getShowByIdForAdmin(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Show", id));
        return mapToAdminShowResponse(show);
    }

    @Override
    public AdminShowResponse createShow(ShowRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new EntityNotFoundException("Movie", request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new EntityNotFoundException("Screen", request.getScreenId()));

        if (!movie.isActive()) {
            throw new IllegalArgumentException("Cannot create a show for an inactive movie.");
        }
        if (!screen.isActive()) {
            throw new IllegalArgumentException("Cannot create a show for an inactive screen.");
        }
        if (!screen.getTheatre().isActive()) {
            throw new IllegalArgumentException("Cannot create a show for a screen in an inactive theatre.");
        }
        if (request.getShowDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Show date cannot be in the past.");
        }

        Show show = new Show(movie, screen, request.getShowDate(), request.getShowTime(), request.getBasePrice());
        Show saved = showRepository.save(show);
        return mapToAdminShowResponse(saved);
    }

    @Override
    public AdminShowResponse updateShow(Long id, ShowRequest request) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Show", id));

        if (!show.getBookings().isEmpty()) {
            // Only allow price updates if bookings exist
            show.setBasePrice(request.getBasePrice());
        } else {
            Movie movie = movieRepository.findById(request.getMovieId())
                    .orElseThrow(() -> new EntityNotFoundException("Movie", request.getMovieId()));
            Screen screen = screenRepository.findById(request.getScreenId())
                    .orElseThrow(() -> new EntityNotFoundException("Screen", request.getScreenId()));
            show.setMovie(movie);
            show.setScreen(screen);
            show.setShowDate(request.getShowDate());
            show.setShowTime(request.getShowTime());
            show.setBasePrice(request.getBasePrice());
        }

        Show saved = showRepository.save(show);
        return mapToAdminShowResponse(saved);
    }

    @Override
    public AdminShowResponse updateShowPrice(Long id, BigDecimal basePrice) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Show", id));
        show.setBasePrice(basePrice);
        Show saved = showRepository.save(show);
        return mapToAdminShowResponse(saved);
    }

    @Override
    public void deactivateShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Show", id));
        show.setActive(false);
        showRepository.save(show);
    }

    private AdminShowResponse mapToAdminShowResponse(Show show) {
        AdminShowResponse r = new AdminShowResponse();
        r.setId(show.getId());
        r.setMovieId(show.getMovie().getId());
        r.setMovieTitle(show.getMovie().getTitle());
        r.setMoviePosterUrl(show.getMovie().getPosterUrl());
        r.setScreenId(show.getScreen().getId());
        r.setScreenName(show.getScreen().getName());
        r.setScreenType(show.getScreen().getScreenType());
        r.setTheatreId(show.getScreen().getTheatre().getId());
        r.setTheatreName(show.getScreen().getTheatre().getName());
        r.setShowDate(show.getShowDate());
        r.setShowTime(show.getShowTime());
        r.setFormattedTime(show.getFormattedTime());
        r.setBasePrice(show.getBasePrice());
        r.setActive(show.isActive());
        r.setBookingCount(show.getBookings().size());
        return r;
    }

    // ══════════════════════════════════════════════════════
    // BOOKINGS (READ-ONLY)
    // ══════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public List<AdminBookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToAdminBookingResponse)
                .collect(Collectors.toList());
    }

    private AdminBookingResponse mapToAdminBookingResponse(Booking booking) {
        AdminBookingResponse r = new AdminBookingResponse();
        r.setId(booking.getId());
        r.setBookingNumber(booking.getBookingNumber());
        r.setUserId(booking.getUser().getId());
        r.setUserName(booking.getUser().getName());
        r.setUserEmail(booking.getUser().getEmail());
        r.setShowId(booking.getShow().getId());
        r.setMovieTitle(booking.getShow().getMovie().getTitle());
        r.setTheatreName(booking.getShow().getScreen().getTheatre().getName());
        r.setScreenName(booking.getShow().getScreen().getName());
        r.setShowDate(booking.getShow().getShowDate().toString());
        r.setShowTime(booking.getShow().getFormattedTime());

        List<String> seatLabels = booking.getBookedSeats().stream()
                .map(bs -> bs.getSeat().getSeatLabel())
                .collect(Collectors.toList());
        r.setSeatLabels(seatLabels);
        r.setSeatCount(seatLabels.size());
        r.setTotalAmount(booking.getTotalAmount());
        r.setConvenienceFee(booking.getConvenienceFee());
        r.setStatus(booking.getStatus().name());
        r.setPaymentStatus(booking.getPaymentStatus().name());
        r.setCreatedAt(booking.getCreatedAt());
        return r;
    }
}
