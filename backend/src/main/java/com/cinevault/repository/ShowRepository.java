package com.cinevault.repository;

import com.cinevault.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    @Query("SELECT s FROM Show s WHERE s.movie.id = :movieId AND s.active = true AND s.showDate >= :fromDate ORDER BY s.showDate, s.showTime")
    List<Show> findActiveShowsByMovieId(@Param("movieId") Long movieId, @Param("fromDate") LocalDate fromDate);

    List<Show> findByScreenIdAndShowDate(Long screenId, LocalDate showDate);

    List<Show> findByActiveTrue();

    // Admin: filter shows by movie, theatre, date
    @Query("""
        SELECT s FROM Show s
        JOIN FETCH s.movie m
        JOIN FETCH s.screen sc
        JOIN FETCH sc.theatre t
        WHERE (:movieId IS NULL OR m.id = :movieId)
          AND (:theatreId IS NULL OR t.id = :theatreId)
          AND (:showDate IS NULL OR s.showDate = :showDate)
        ORDER BY s.showDate DESC, s.showTime
        """)
    List<Show> findAllForAdmin(
            @Param("movieId") Long movieId,
            @Param("theatreId") Long theatreId,
            @Param("showDate") LocalDate showDate);

    long countByActiveTrue();

    // Dashboard: sum revenue from confirmed bookings
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = com.cinevault.entity.enums.BookingStatus.CONFIRMED")
    BigDecimal sumConfirmedRevenue();
}
