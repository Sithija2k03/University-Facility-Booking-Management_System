package com.sliit.smartcampus.ticketcomment.service;

import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.common.exception.TicketCommentNotFoundException;
import com.sliit.smartcampus.common.exception.TicketNotFoundException;
import com.sliit.smartcampus.common.exception.UnauthorizedCommentActionException;
import com.sliit.smartcampus.notification.service.NotificationService;
import com.sliit.smartcampus.ticket.entity.Ticket;
import com.sliit.smartcampus.ticket.repository.TicketRepository;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentRequestDto;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentResponseDto;
import com.sliit.smartcampus.ticketcomment.dto.TicketCommentUpdateDto;
import com.sliit.smartcampus.ticketcomment.entity.TicketComment;
import com.sliit.smartcampus.ticketcomment.repository.TicketCommentRepository;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TicketCommentService(
            TicketCommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public TicketCommentResponseDto addComment(Long ticketId, TicketCommentRequestDto dto) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getAuthorId()));

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .author(author)
                .content(dto.getContent().trim())
                .build();

        TicketComment saved = commentRepository.save(comment);

        // Notify ticket reporter if the commenter is someone else
        if (!ticket.getReporter().getId().equals(author.getId())) {
            notificationService.createNotification(
                    ticket.getReporter().getId(),
                    "New Comment on Your Ticket",
                    author.getName() + " commented on your ticket.",
                    "COMMENT",
                    ticket.getId()
            );
        }

        // Notify assigned technician if there is one and they are not the commenter and not the reporter
        if (ticket.getAssignedTechnician() != null
                && !ticket.getAssignedTechnician().getId().equals(author.getId())
                && !ticket.getAssignedTechnician().getId().equals(ticket.getReporter().getId())) {

            notificationService.createNotification(
                    ticket.getAssignedTechnician().getId(),
                    "New Comment on Assigned Ticket",
                    author.getName() + " added a comment on ticket ID " + ticket.getId() + ".",
                    "COMMENT",
                    ticket.getId()
            );
        }

        return mapToResponse(saved);
    }

    public List<TicketCommentResponseDto> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketCommentResponseDto updateComment(Long commentId, Long requesterUserId, TicketCommentUpdateDto dto) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new TicketCommentNotFoundException("Comment not found with id: " + commentId));

        User requester = userRepository.findById(requesterUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requesterUserId));

        boolean isOwner = comment.getAuthor().getId().equals(requesterUserId);
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedCommentActionException("You are not allowed to edit this comment");
        }

        comment.setContent(dto.getContent().trim());
        TicketComment updated = commentRepository.save(comment);

        return mapToResponse(updated);
    }

    public void deleteComment(Long commentId, Long requesterUserId) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new TicketCommentNotFoundException("Comment not found with id: " + commentId));

        User requester = userRepository.findById(requesterUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requesterUserId));

        boolean isOwner = comment.getAuthor().getId().equals(requesterUserId);
        boolean isAdmin = requester.getRole() == RoleType.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedCommentActionException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private TicketCommentResponseDto mapToResponse(TicketComment comment) {
        return TicketCommentResponseDto.builder()
                .id(comment.getId())
                .ticketId(comment.getTicket().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .authorEmail(comment.getAuthor().getEmail())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}