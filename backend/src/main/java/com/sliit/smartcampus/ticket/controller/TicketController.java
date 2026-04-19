package com.sliit.smartcampus.ticket.controller;

import com.sliit.smartcampus.common.enums.TicketStatus;
import com.sliit.smartcampus.ticket.dto.*;
import com.sliit.smartcampus.ticket.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public TicketResponseDto createTicket(@Valid @RequestBody TicketRequestDto dto) {
        return ticketService.createTicket(dto);
    }

    @GetMapping
    public List<TicketResponseDto> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/my")
    public List<TicketResponseDto> getMyTickets() {
        return ticketService.getMyTickets();
    }

    @GetMapping("/{id}")
    public TicketResponseDto getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/reporter/{reporterId}")
    public List<TicketResponseDto> getTicketsByReporterId(@PathVariable Long reporterId) {
        return ticketService.getTicketsByReporterId(reporterId);
    }

    @GetMapping("/status/{status}")
    public List<TicketResponseDto> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ticketService.getTicketsByStatus(status);
    }

    @PatchMapping("/{id}/assign")
    public TicketResponseDto assignTechnician(@PathVariable Long id, @Valid @RequestBody TicketAssignDto dto) {
        return ticketService.assignTechnician(id, dto);
    }

    @PatchMapping("/{id}/status")
    public TicketResponseDto updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusUpdateDto dto) {
        return ticketService.updateStatus(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return "Ticket deleted successfully";
    }
}