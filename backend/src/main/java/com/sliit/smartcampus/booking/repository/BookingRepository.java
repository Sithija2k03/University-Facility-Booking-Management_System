package com.sliit.smartcampus.booking.repository;

import com.sliit.smartcampus.booking.entity.Booking;
import com.sliit.smartcampus.common.enums.BookingStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Override
    @EntityGraph(attributePaths = {"user", "resource"})
    List<Booking> findAll();

    @EntityGraph(attributePaths = {"user", "resource"})
    List<Booking> findByUserId(Long userId);

    List<Booking> findByStatus(BookingStatus status);

    @EntityGraph(attributePaths = {"user", "resource"})
    List<Booking> findByResourceId(Long resourceId);

    @EntityGraph(attributePaths = {"user", "resource"})
    List<Booking> findByResourceIdAndBookingDate(Long resourceId, LocalDate bookingDate);

    @EntityGraph(attributePaths = {"user", "resource"})
    Optional<Booking> findWithUserAndResourceById(Long id);

    boolean existsByResourceIdAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Long resourceId,
            LocalDate bookingDate,
            List<BookingStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );
}