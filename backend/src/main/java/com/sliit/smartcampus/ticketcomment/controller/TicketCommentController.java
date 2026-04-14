package com.sliit.smartcampus.ticketcomment.controller;

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
            @RequestParam Long requesterUserId,
            @Valid @RequestBody TicketCommentUpdateDto dto
    ) {
        return commentService.updateComment(commentId, requesterUserId, dto);
    }

    @DeleteMapping("/{commentId}")
    public String deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestParam Long requesterUserId
    ) {
        commentService.deleteComment(commentId, requesterUserId);
        return "Comment deleted successfully";
    }
}