package com.sliit.smartcampus.booking.controller;

import com.sliit.smartcampus.booking.dto.BookingDecisionDto;
import com.sliit.smartcampus.booking.dto.BookingRequestDto;
import com.sliit.smartcampus.booking.dto.BookingResponseDto;
import com.sliit.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponseDto createBooking(@Valid @RequestBody BookingRequestDto dto) {
        return bookingService.createBooking(dto);
    }

    @GetMapping
    public List<BookingResponseDto> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public BookingResponseDto getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public List<BookingResponseDto> getBookingsByUserId(@PathVariable Long userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/resource/{id}")
    public List<BookingResponseDto> getBookingsByResourceId(@PathVariable Long id) {
        return bookingService.getBookingsByResourceId(id);
    }

    @GetMapping("/resource/{id}/date/{bookingDate}")
    public List<BookingResponseDto> getBookingsByResourceAndDate(
            @PathVariable Long id,
            @PathVariable LocalDate bookingDate
    ) {
        return bookingService.getBookingsByResourceAndDate(id, bookingDate);
    }

    @PatchMapping("/{id}/approve")
    public BookingResponseDto approveBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDecisionDto dto
    ) {
        return bookingService.approveBooking(id, dto);
    }

    @PatchMapping("/{id}/reject")
    public BookingResponseDto rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDecisionDto dto
    ) {
        return bookingService.rejectBooking(id, dto);
    }

    @PatchMapping("/{id}/cancel")
    public BookingResponseDto cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        return bookingService.cancelBooking(id, reason);
    }
}