package com.cinevault.repository;

import com.cinevault.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByActiveTrue();
    List<Movie> findByActiveTrueAndFeaturedTrue();
    List<Movie> findByActiveTrueAndStatus(String status);
    List<Movie> findByActiveTrueAndTitleContainingIgnoreCase(String title);

    // Admin: all movies regardless of active status, with optional search
    @Query("SELECT m FROM Movie m WHERE (:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY m.id DESC")
    List<Movie> findAllForAdmin(@Param("search") String search);

    long countByActiveTrue();
}
