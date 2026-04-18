package com.sliit.smartcampus.ticket.service;

import com.sliit.smartcampus.common.enums.TicketStatus;
import com.sliit.smartcampus.common.exception.ResourceNotFoundException;
import com.sliit.smartcampus.common.exception.TicketNotFoundException;
import com.sliit.smartcampus.notification.service.NotificationService;
import com.sliit.smartcampus.resource.entity.Resource;
import com.sliit.smartcampus.resource.repository.ResourceRepository;
import com.sliit.smartcampus.ticket.dto.*;
import com.sliit.smartcampus.ticket.entity.Ticket;
import com.sliit.smartcampus.ticket.repository.TicketRepository;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sliit.smartcampus.auth.security.SecurityUtils;
import com.sliit.smartcampus.common.exception.UnauthorizedAccessException;

import java.util.List;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            ResourceRepository resourceRepository,
            NotificationService notificationService
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    public TicketResponseDto createTicket(TicketRequestDto dto) {
        User reporter = userRepository.findById(dto.getReporterId())
                .orElseThrow(() -> new RuntimeException("Reporter not found with id: " + dto.getReporterId()));

        Resource resource = null;
        if (dto.getResourceId() != null) {
            resource = resourceRepository.findById(dto.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));
        }

        Ticket ticket = Ticket.builder()
                .reporter(reporter)
                .resource(resource)
                .locationText(dto.getLocationText().trim())
                .category(dto.getCategory().trim())
                .description(dto.getDescription().trim())
                .priority(dto.getPriority())
                .preferredContact(dto.getPreferredContact().trim())
                .status(TicketStatus.OPEN)
                .build();

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(
                reporter.getId(),
                "Ticket Submitted",
                "Your ticket has been created successfully with status OPEN.",
                "TICKET",
                saved.getId()
        );

        return mapToResponse(saved);
    }

    public List<TicketResponseDto> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketResponseDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + id));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");
        boolean isTechnician = SecurityUtils.hasRole("TECHNICIAN");

        boolean isReporter = ticket.getReporter().getId().equals(currentUserId);
        boolean isAssignedTechnician = ticket.getAssignedTechnician() != null &&
                ticket.getAssignedTechnician().getId().equals(currentUserId);

        if (!isReporter && !isAdmin && !isTechnician && !isAssignedTechnician) {
            throw new UnauthorizedAccessException("You are not allowed to view this ticket");
        }

        return mapToResponse(ticket);
    }

    public List<TicketResponseDto> getTicketsByReporterId(Long reporterId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");

        if (!currentUserId.equals(reporterId) && !isAdmin) {
            throw new UnauthorizedAccessException("You are not allowed to view other users' tickets");
        }

        return ticketRepository.findByReporterId(reporterId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TicketResponseDto> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketResponseDto assignTechnician(Long ticketId, TicketAssignDto dto) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        User technician = userRepository.findById(dto.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found with id: " + dto.getTechnicianId()));

        ticket.setAssignedTechnician(technician);

        Ticket updated = ticketRepository.save(ticket);

        notificationService.createNotification(
                updated.getReporter().getId(),
                "Technician Assigned",
                "A technician has been assigned to your ticket.",
                "TICKET",
                updated.getId()
        );

        notificationService.createNotification(
                technician.getId(),
                "New Ticket Assigned",
                "You have been assigned to ticket ID " + updated.getId() + ".",
                "TICKET",
                updated.getId()
        );

        return mapToResponse(updated);
    }

    public TicketResponseDto updateStatus(Long ticketId, TicketStatusUpdateDto dto) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        TicketStatus previousStatus = ticket.getStatus();

        validateStatusTransition(previousStatus, dto.getStatus());

        ticket.setStatus(dto.getStatus());

        if (dto.getResolutionNotes() != null && !dto.getResolutionNotes().isBlank()) {
            ticket.setResolutionNotes(dto.getResolutionNotes().trim());
        }

        Ticket updated = ticketRepository.save(ticket);

        String message = "Your ticket status has changed from " + previousStatus + " to " + updated.getStatus() + ".";
        if (updated.getResolutionNotes() != null && !updated.getResolutionNotes().isBlank()) {
            message += " Notes: " + updated.getResolutionNotes();
        }

        notificationService.createNotification(
                updated.getReporter().getId(),
                "Ticket Status Updated",
                message,
                "TICKET",
                updated.getId()
        );

        if (updated.getAssignedTechnician() != null &&
                !updated.getAssignedTechnician().getId().equals(updated.getReporter().getId())) {
            notificationService.createNotification(
                    updated.getAssignedTechnician().getId(),
                    "Ticket Status Updated",
                    "Ticket ID " + updated.getId() + " status is now " + updated.getStatus() + ".",
                    "TICKET",
                    updated.getId()
            );
        }

        return mapToResponse(updated);
    }

    private void validateStatusTransition(TicketStatus current, TicketStatus next) {
        if (current == TicketStatus.CLOSED || current == TicketStatus.REJECTED) {
            throw new IllegalArgumentException("Closed or rejected tickets cannot be changed");
        }

        if (current == TicketStatus.OPEN &&
                !(next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED)) {
            throw new IllegalArgumentException("OPEN tickets can only move to IN_PROGRESS or REJECTED");
        }

        if (current == TicketStatus.IN_PROGRESS &&
                !(next == TicketStatus.RESOLVED || next == TicketStatus.REJECTED)) {
            throw new IllegalArgumentException("IN_PROGRESS tickets can only move to RESOLVED or REJECTED");
        }

        if (current == TicketStatus.RESOLVED &&
                next != TicketStatus.CLOSED) {
            throw new IllegalArgumentException("RESOLVED tickets can only move to CLOSED");
        }
    }

    private TicketResponseDto mapToResponse(Ticket ticket) {
        return TicketResponseDto.builder()
                .id(ticket.getId())
                .reporterId(ticket.getReporter().getId())
                .reporterName(ticket.getReporter().getName())
                .reporterEmail(ticket.getReporter().getEmail())
                .resourceId(ticket.getResource() != null ? ticket.getResource().getId() : null)
                .resourceName(ticket.getResource() != null ? ticket.getResource().getName() : null)
                .locationText(ticket.getLocationText())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContact(ticket.getPreferredContact())
                .status(ticket.getStatus())
                .assignedTechnicianId(ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getId() : null)
                .assignedTechnicianName(ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getName() : null)
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}