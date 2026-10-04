package com.cinevault.service.impl;

import com.cinevault.dto.SeatLayoutResponse;
import com.cinevault.dto.ShowResponse;
import com.cinevault.entity.Seat;
import com.cinevault.entity.Show;
import com.cinevault.exception.ShowNotFoundException;
import com.cinevault.repository.BookingSeatRepository;
import com.cinevault.repository.SeatRepository;
import com.cinevault.repository.ShowRepository;
import com.cinevault.service.ShowService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public ShowServiceImpl(ShowRepository showRepository,
                           SeatRepository seatRepository,
                           BookingSeatRepository bookingSeatRepository) {
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Override
    public List<ShowResponse> getShowsForMovie(Long movieId) {
        LocalDate today = LocalDate.now();
        List<Show> shows = showRepository.findActiveShowsByMovieId(movieId, today);

        return shows.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ShowResponse getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ShowNotFoundException(id));
        return mapToResponse(show);
    }

    @Override
    public SeatLayoutResponse getSeatLayoutForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ShowNotFoundException(showId));

        // Get all seats for this show's screen
        List<Seat> seats = seatRepository.findByScreenIdOrderByRowLabelAscSeatNumberAsc(
                show.getScreen().getId());

        // Get IDs of seats already booked for this specific show
        Set<Long> bookedSeatIds = new HashSet<>(
                bookingSeatRepository.findBookedSeatIdsByShowId(showId));

        // Group seats by row and build the layout response
        // Using LinkedHashMap to preserve insertion order
        Map<String, List<Seat>> seatsByRow = seats.stream()
                .collect(Collectors.groupingBy(
                        Seat::getRowLabel,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<SeatLayoutResponse.SeatRow> rows = seatsByRow.entrySet().stream()
                .map(entry -> {
                    String rowLabel = entry.getKey();
                    List<Seat> rowSeats = entry.getValue();

                    // Get category from first seat in row (all seats in a row share category)
                    String category = rowSeats.isEmpty() ? "Standard" :
                            rowSeats.get(0).getCategory().getDisplayName();

                    List<SeatLayoutResponse.SeatInfo> seatInfos = rowSeats.stream()
                            .map(seat -> new SeatLayoutResponse.SeatInfo(
                                    seat.getSeatLabel(),
                                    seat.getSeatNumber(),
                                    bookedSeatIds.contains(seat.getId()) ? "booked" : "available"
                            ))
                            .collect(Collectors.toList());

                    return new SeatLayoutResponse.SeatRow(rowLabel, category, seatInfos);
                })
                .collect(Collectors.toList());

        return new SeatLayoutResponse(rows);
    }

    private ShowResponse mapToResponse(Show show) {
        ShowResponse response = new ShowResponse();
        response.setId(show.getId());
        response.setMovieId(show.getMovie().getId());
        response.setTheatreId(show.getScreen().getTheatre().getId());
        response.setDate(show.getShowDate());
        response.setTime(show.getFormattedTime());
        response.setPrice(show.getBasePrice());
        response.setScreenType(show.getScreen().getScreenType());
        return response;
    }
}
