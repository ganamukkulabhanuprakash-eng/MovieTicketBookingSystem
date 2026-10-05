package com.cinevault.repository;

import com.cinevault.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByTheatreId(Long theatreId);
    List<Screen> findByTheatreIdAndActiveTrue(Long theatreId);

    @Query("SELECT sc FROM Screen sc JOIN FETCH sc.theatre t WHERE (:theatreId IS NULL OR t.id = :theatreId) ORDER BY t.name, sc.name")
    List<Screen> findAllForAdmin(@Param("theatreId") Long theatreId);

    boolean existsByTheatreIdAndName(Long theatreId, String name);
}
