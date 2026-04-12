package com.sliit.smartcampus.ticket.dto;

import com.sliit.smartcampus.common.enums.Priority;
import com.sliit.smartcampus.common.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponseDto {

    private Long id;

    private Long reporterId;
    private String reporterName;
    private String reporterEmail;

    private Long resourceId;
    private String resourceName;

    private String locationText;
    private String category;
    private String description;
    private Priority priority;
    private String preferredContact;
    private TicketStatus status;

    private Long assignedTechnicianId;
    private String assignedTechnicianName;

    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}