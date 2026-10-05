package com.cinevault.service.impl;

import com.cinevault.dto.BookingRequest;
import com.cinevault.dto.BookingResponse;
import com.cinevault.entity.*;
import com.cinevault.entity.enums.BookingStatus;
import com.cinevault.entity.enums.PaymentStatus;
import com.cinevault.exception.BookingNotFoundException;
import com.cinevault.exception.EntityNotFoundException;
import com.cinevault.exception.InvalidBookingException;
import com.cinevault.exception.SeatAlreadyBookedException;
import com.cinevault.repository.*;
import com.cinevault.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              BookingSeatRepository bookingSeatRepository,
                              ShowRepository showRepository,
                              SeatRepository seatRepository,
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        if (request.getSeatLabels() == null || request.getSeatLabels().isEmpty()) {
            throw new InvalidBookingException("At least one seat must be selected");
        }

        // 1. Fetch user (if null or not found, fall back to default customer for seamless college demo)
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByEmail("bhanu@gmail.com")
                    .orElseGet(() -> userRepository.findAll().stream()
                            .filter(u -> !u.isAdmin())
                            .findFirst()
                            .orElseThrow(() -> new InvalidBookingException("No customer account found to associate booking")));
        }

        // 2. Fetch and validate show
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new EntityNotFoundException("Show", request.getShowId()));

        if (!show.isActive()) {
            throw new InvalidBookingException("This screening is currently inactive");
        }

        // 3. Resolve requested seats for the show's screen
        Screen screen = show.getScreen();
        List<Seat> allScreenSeats = seatRepository.findByScreenIdOrderByRowLabelAscSeatNumberAsc(screen.getId());
        Map<String, Seat> seatMap = allScreenSeats.stream()
                .collect(Collectors.toMap(Seat::getSeatLabel, s -> s, (s1, s2) -> s1));

        List<Seat> targetSeats = new ArrayList<>();
        for (String label : request.getSeatLabels()) {
            Seat seat = seatMap.get(label.trim());
            if (seat == null) {
                throw new InvalidBookingException("Seat " + label + " does not exist on " + screen.getName());
            }
            targetSeats.add(seat);
        }

        // 4. Duplicate booking check at business logic level
        Set<Long> alreadyBookedSeatIds = new HashSet<>(
                bookingSeatRepository.findBookedSeatIdsByShowId(show.getId())
        );

        List<String> conflicts = targetSeats.stream()
                .filter(seat -> alreadyBookedSeatIds.contains(seat.getId()))
                .map(Seat::getSeatLabel)
                .collect(Collectors.toList());

        if (!conflicts.isEmpty()) {
            throw new SeatAlreadyBookedException(conflicts);
        }

        // 5. Calculate ticket prices dynamically from show pricing
        BigDecimal ticketAmount = BigDecimal.ZERO;
        Map<Seat, BigDecimal> seatPrices = new HashMap<>();
        for (Seat seat : targetSeats) {
            BigDecimal price = show.getPriceForCategory(seat.getCategory());
            seatPrices.put(seat, price);
            ticketAmount = ticketAmount.add(price);
        }

        BigDecimal convenienceFee = BigDecimal.valueOf(30.00).multiply(BigDecimal.valueOf(targetSeats.size()));
        BigDecimal totalAmount = ticketAmount.add(convenienceFee);

        // 6. Generate human-readable unique booking number
        String bookingNumber = "BKG-" + (System.currentTimeMillis() % 10000000) + "-" +
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        // 7. Persist booking
        Booking booking = new Booking(bookingNumber, user, show, totalAmount);
        booking.setConvenienceFee(convenienceFee);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setPaymentTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Booking savedBooking = bookingRepository.save(booking);

        // 8. Persist individual booking seats (protected by DB unique constraint on show_id + seat_id)
        for (Seat seat : targetSeats) {
            BookingSeat bs = new BookingSeat(savedBooking, seat, show, seatPrices.get(seat));
            bookingSeatRepository.save(bs);
            savedBooking.addBookedSeat(bs);
        }

        return mapToResponse(savedBooking, ticketAmount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        if (userId == null) {
            User fallback = userRepository.findByEmail("bhanu@gmail.com")
                    .orElseGet(() -> userRepository.findAll().stream()
                            .filter(u -> !u.isAdmin())
                            .findFirst()
                            .orElse(null));
            if (fallback != null) {
                userId = fallback.getId();
            } else {
                return Collections.emptyList();
            }
        }
        List<Booking> list = bookingRepository.findByUserId(userId);
        return list.stream()
                .sorted((b1, b2) -> {
                    if (b1.getCreatedAt() != null && b2.getCreatedAt() != null) {
                        return b2.getCreatedAt().compareTo(b1.getCreatedAt());
                    }
                    return Long.compare(b2.getId() != null ? b2.getId() : 0, b1.getId() != null ? b1.getId() : 0);
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new BookingNotFoundException(bookingNumber));
        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking b) {
        BigDecimal ticketAmount = b.getTotalAmount() != null && b.getConvenienceFee() != null
                ? b.getTotalAmount().subtract(b.getConvenienceFee())
                : b.getTotalAmount();
        return mapToResponse(b, ticketAmount);
    }

    private BookingResponse mapToResponse(Booking b, BigDecimal ticketAmount) {
        BookingResponse resp = new BookingResponse();
        resp.setId(b.getId());
        resp.setBookingNumber(b.getBookingNumber());
        resp.setCreatedAt(b.getCreatedAt());
        resp.setStatus(b.getStatus() != null ? b.getStatus().name() : "CONFIRMED");
        resp.setPaymentStatus(b.getPaymentStatus() != null ? b.getPaymentStatus().name() : "PAID");
        resp.setTotalAmount(b.getTotalAmount());
        resp.setConvenienceFee(b.getConvenienceFee());
        resp.setTicketAmount(ticketAmount);

        if (b.getShow() != null) {
            Show s = b.getShow();
            resp.setShowId(s.getId());
            resp.setShowDate(s.getShowDate());
            resp.setShowTime(s.getFormattedTime());

            if (s.getMovie() != null) {
                resp.setMovieId(s.getMovie().getId());
                resp.setMovieTitle(s.getMovie().getTitle());
                resp.setMoviePoster(s.getMovie().getPosterUrl());
            }

            if (s.getScreen() != null) {
                resp.setScreenName(s.getScreen().getName());
                resp.setScreenType(s.getScreen().getScreenType());

                if (s.getScreen().getTheatre() != null) {
                    Theatre t = s.getScreen().getTheatre();
                    resp.setTheatreId(t.getId());
                    resp.setTheatreName(t.getName());
                    resp.setTheatreLocation(t.getLocation());
                }
            }
        }

        List<String> seatLabels = b.getBookedSeats() != null
                ? b.getBookedSeats().stream()
                .map(bs -> bs.getSeat() != null ? bs.getSeat().getSeatLabel() : "")
                .filter(label -> !label.isEmpty())
                .collect(Collectors.toList())
                : Collections.emptyList();

        resp.setSeats(seatLabels);
        resp.setSeatCount(seatLabels.size());
        return resp;
    }
}
