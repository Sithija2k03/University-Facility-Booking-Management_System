package com.sliit.smartcampus.booking.dto;

import com.sliit.smartcampus.common.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {

    private Long id;

    private Long userId;
    private String userName;
    private String userEmail;

    private Long resourceId;
    private String resourceName;
    private String resourceLocation;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private Integer expectedAttendees;

    private BookingStatus status;
    private String adminReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}