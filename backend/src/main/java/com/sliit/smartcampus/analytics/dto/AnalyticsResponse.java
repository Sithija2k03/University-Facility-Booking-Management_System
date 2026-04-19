package com.sliit.smartcampus.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {

    // Top 5 most booked resources: [{name, count}]
    private List<Map<String, Object>> topBookedResources;

    // Bookings per hour of day: [{hour, count}]
    private List<Map<String, Object>> peakBookingHours;

    // Bookings by status: [{status, count}]
    private List<Map<String, Object>> bookingsByStatus;

    // Tickets by status: [{status, count}]
    private List<Map<String, Object>> ticketsByStatus;

    // Tickets by priority: [{priority, count}]
    private List<Map<String, Object>> ticketsByPriority;

    // Summary counts
    private long totalBookings;
    private long totalTickets;
    private long totalResources;
    private long resolvedTickets;
}