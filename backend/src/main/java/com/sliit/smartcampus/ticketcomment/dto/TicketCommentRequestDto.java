package com.sliit.smartcampus.ticketcomment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCommentRequestDto {

    @NotBlank(message = "Content is required")
    private String content;
}