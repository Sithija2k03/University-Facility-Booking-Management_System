package com.sliit.smartcampus.analytics.service;

import com.sliit.smartcampus.analytics.dto.AnalyticsResponse;
import com.sliit.smartcampus.booking.entity.Booking;
import com.sliit.smartcampus.booking.repository.BookingRepository;
import com.sliit.smartcampus.resource.repository.ResourceRepository;
import com.sliit.smartcampus.ticket.entity.Ticket;
import com.sliit.smartcampus.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;

    public AnalyticsResponse getAdminAnalytics() {
        List<Booking> allBookings = bookingRepository.findAll();
        List<Ticket> allTickets = ticketRepository.findAll();
        long totalResources = resourceRepository.count();

        return AnalyticsResponse.builder()
                .topBookedResources(getTopBookedResources(allBookings))
                .peakBookingHours(getPeakBookingHours(allBookings))
                .bookingsByStatus(getBookingsByStatus(allBookings))
                .ticketsByStatus(getTicketsByStatus(allTickets))
                .ticketsByPriority(getTicketsByPriority(allTickets))
                .totalBookings(allBookings.size())
                .totalTickets(allTickets.size())
                .totalResources(totalResources)
                .resolvedTickets(allTickets.stream()
                        .filter(t -> t.getStatus() != null &&
                                (t.getStatus().name().equals("RESOLVED") ||
                                        t.getStatus().name().equals("CLOSED")))
                        .count())
                .build();
    }

    private List<Map<String, Object>> getTopBookedResources(List<Booking> bookings) {
        return bookings.stream()
                .filter(b -> b.getResource() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getResource().getName(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("name", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getPeakBookingHours(List<Booking> bookings) {
        Map<Integer, Long> hourCounts = bookings.stream()
                .filter(b -> b.getStartTime() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getStartTime().getHour(),
                        Collectors.counting()
                ));

        // Fill all 24 hours so chart has no gaps
        List<Map<String, Object>> result = new ArrayList<>();
        for (int hour = 6; hour <= 22; hour++) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("hour", hour + ":00");
            m.put("count", hourCounts.getOrDefault(hour, 0L));
            result.add(m);
        }
        return result;
    }

    private List<Map<String, Object>> getBookingsByStatus(List<Booking> bookings) {
        return bookings.stream()
                .filter(b -> b.getStatus() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getStatus().name(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("status", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTicketsByStatus(List<Ticket> tickets) {
        return tickets.stream()
                .filter(t -> t.getStatus() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getStatus().name(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("status", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTicketsByPriority(List<Ticket> tickets) {
        return tickets.stream()
                .filter(t -> t.getPriority() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getPriority().name(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("priority", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }
}