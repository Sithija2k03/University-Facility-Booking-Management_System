package com.sliit.smartcampus.ticket.dto;

import com.sliit.smartcampus.common.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequestDto {

    @NotNull(message = "Reporter ID is required")
    private Long reporterId;

    private Long resourceId;

    @NotBlank(message = "Location is required")
    private String locationText;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;
}