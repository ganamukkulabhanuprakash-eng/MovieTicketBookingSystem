package com.cinevault.repository;

import com.cinevault.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    @Query("SELECT s FROM Show s WHERE s.movie.id = :movieId AND s.active = true AND s.showDate >= :fromDate ORDER BY s.showDate, s.showTime")
    List<Show> findActiveShowsByMovieId(@Param("movieId") Long movieId, @Param("fromDate") LocalDate fromDate);

    List<Show> findByScreenIdAndShowDate(Long screenId, LocalDate showDate);

    List<Show> findByActiveTrue();
}
