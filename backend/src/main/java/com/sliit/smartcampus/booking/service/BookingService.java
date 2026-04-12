package com.sliit.smartcampus.booking.service;

import com.sliit.smartcampus.booking.dto.BookingDecisionDto;
import com.sliit.smartcampus.booking.dto.BookingRequestDto;
import com.sliit.smartcampus.booking.dto.BookingResponseDto;
import com.sliit.smartcampus.booking.entity.Booking;
import com.sliit.smartcampus.booking.repository.BookingRepository;
import com.sliit.smartcampus.common.enums.BookingStatus;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.exception.BookingConflictException;
import com.sliit.smartcampus.common.exception.BookingNotFoundException;
import com.sliit.smartcampus.common.exception.ResourceNotFoundException;
import com.sliit.smartcampus.resource.entity.Resource;
import com.sliit.smartcampus.resource.repository.ResourceRepository;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ResourceRepository resourceRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    public BookingResponseDto createBooking(BookingRequestDto dto) {
        validateBookingRequest(dto);

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new BookingConflictException("This resource is not currently available for booking");
        }

        if (resource.getAvailableFrom() != null && dto.getStartTime().isBefore(resource.getAvailableFrom())) {
            throw new BookingConflictException("Booking start time is before the resource availability window");
        }

        if (resource.getAvailableTo() != null && dto.getEndTime().isAfter(resource.getAvailableTo())) {
            throw new BookingConflictException("Booking end time is after the resource availability window");
        }

        boolean conflictExists = bookingRepository
                .existsByResourceIdAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                        dto.getResourceId(),
                        dto.getBookingDate(),
                        List.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                        dto.getEndTime(),
                        dto.getStartTime()
                );

        if (conflictExists) {
            throw new BookingConflictException("A conflicting booking already exists for this resource and time range");
        }

        if (resource.getCapacity() != null && dto.getExpectedAttendees() != null
                && dto.getExpectedAttendees() > resource.getCapacity()) {
            throw new BookingConflictException("Expected attendees exceed the resource capacity");
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .bookingDate(dto.getBookingDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose().trim())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<BookingResponseDto> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        return mapToResponse(booking);
    }

    public BookingResponseDto approveBooking(Long id, BookingDecisionDto dto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReason(dto.getReason().trim());

        Booking updated = bookingRepository.save(booking);
        return mapToResponse(updated);
    }

    public BookingResponseDto rejectBooking(Long id, BookingDecisionDto dto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(dto.getReason().trim());

        Booking updated = bookingRepository.save(booking);
        return mapToResponse(updated);
    }

    public BookingResponseDto cancelBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingConflictException("Only pending or approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminReason(reason != null && !reason.isBlank() ? reason.trim() : "Cancelled by user");

        Booking updated = bookingRepository.save(booking);
        return mapToResponse(updated);
    }

    private void validateBookingRequest(BookingRequestDto dto) {
        if (dto.getStartTime() != null && dto.getEndTime() != null) {
            if (!dto.getStartTime().isBefore(dto.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
        }
    }

    private BookingResponseDto mapToResponse(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .resourceLocation(booking.getResource().getLocation())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminReason(booking.getAdminReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}