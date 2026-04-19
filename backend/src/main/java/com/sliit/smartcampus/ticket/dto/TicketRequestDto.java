package com.sliit.smartcampus.ticket.dto;

import com.sliit.smartcampus.common.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TicketRequestDto {

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
    @Pattern(
            regexp = "^(?:[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}|\\+?[0-9]{7,15})$",
            message = "Preferred contact must be a valid email address or phone number"
    )
    private String preferredContact;
}