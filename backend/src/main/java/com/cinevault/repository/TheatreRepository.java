package com.cinevault.repository;

import com.cinevault.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheatreRepository extends JpaRepository<Theatre, Long> {
    List<Theatre> findByActiveTrue();
    List<Theatre> findByActiveTrueAndCity(String city);

    // Admin: all theatres with optional name/location search
    @Query("SELECT t FROM Theatre t WHERE (:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.location) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY t.name")
    List<Theatre> findAllForAdmin(@Param("search") String search);

    long countByActiveTrue();
}
