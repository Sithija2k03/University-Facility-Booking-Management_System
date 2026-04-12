package com.sliit.smartcampus.ticket.dto;

import com.sliit.smartcampus.common.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateDto {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String resolutionNotes;
}