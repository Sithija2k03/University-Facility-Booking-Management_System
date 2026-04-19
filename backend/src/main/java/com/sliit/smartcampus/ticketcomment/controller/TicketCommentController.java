package com.sliit.smartcampus.ticketcomment.controller;

import com.sliit.smartcampus.auth.security.SecurityUtils;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentRequestDto;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentResponseDto;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentUpdateDto;
import com.sliit.smartcampus.ticketcomment.service.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class TicketCommentController {

    private final TicketCommentService commentService;

    public TicketCommentController(TicketCommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public TicketCommentResponseDto addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketCommentRequestDto dto
    ) {
        return commentService.addComment(ticketId, dto);
    }

    @GetMapping
    public List<TicketCommentResponseDto> getComments(@PathVariable Long ticketId) {
        return commentService.getCommentsByTicketId(ticketId);
    }

    @PutMapping("/{commentId}")
    public TicketCommentResponseDto updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @Valid @RequestBody TicketCommentUpdateDto dto
    ) {
        Long requesterId = SecurityUtils.getCurrentUserId();
        return commentService.updateComment(ticketId, commentId, requesterId, dto);
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId
    ) {
        Long requesterId = SecurityUtils.getCurrentUserId();
        commentService.deleteComment(ticketId, commentId, requesterId);
        return "Comment deleted successfully";
    }
}