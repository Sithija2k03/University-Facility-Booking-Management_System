package com.sliit.smartcampus.ticketcomment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketCommentRequestDto {

    @NotNull(message = "Author ID is required")
    private Long authorId;

    @NotBlank(message = "Content is required")
    private String content;
}