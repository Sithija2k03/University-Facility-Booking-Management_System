package com.sliit.smartcampus.ticket.repository;

import com.sliit.smartcampus.common.enums.TicketStatus;
import com.sliit.smartcampus.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByReporterId(Long reporterId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByAssignedTechnicianId(Long technicianId);

    List<Ticket> findByResourceId(Long resourceId);
}