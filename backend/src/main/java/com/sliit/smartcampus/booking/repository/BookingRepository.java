package com.sliit.smartcampus.booking.repository;

import com.sliit.smartcampus.booking.entity.Booking;
import com.sliit.smartcampus.common.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceId(Long resourceId);

    List<Booking> findByResourceIdAndBookingDate(Long resourceId, LocalDate bookingDate);

    boolean existsByResourceIdAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Long resourceId,
            LocalDate bookingDate,
            List<BookingStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );
}