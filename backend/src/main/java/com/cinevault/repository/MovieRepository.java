package com.cinevault.repository;

import com.cinevault.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByActiveTrue();
    List<Movie> findByActiveTrueAndFeaturedTrue();
    List<Movie> findByActiveTrueAndStatus(String status);
    List<Movie> findByActiveTrueAndTitleContainingIgnoreCase(String title);
}
