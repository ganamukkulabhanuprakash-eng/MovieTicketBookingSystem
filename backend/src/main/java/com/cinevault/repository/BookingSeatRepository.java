package com.cinevault.repository;

import com.cinevault.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    /**
     * Find all booked seat IDs for a specific show.
     * Only considers CONFIRMED or PENDING bookings (not cancelled).
     */
    @Query("SELECT bs.seat.id FROM BookingSeat bs WHERE bs.show.id = :showId AND bs.booking.status IN (com.cinevault.entity.enums.BookingStatus.CONFIRMED, com.cinevault.entity.enums.BookingStatus.PENDING)")
    List<Long> findBookedSeatIdsByShowId(@Param("showId") Long showId);
}
