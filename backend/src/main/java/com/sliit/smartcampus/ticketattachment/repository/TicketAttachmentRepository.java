package com.sliit.smartcampus.ticketattachment.repository;

import com.sliit.smartcampus.ticketattachment.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    List<TicketAttachment> findByTicketId(Long ticketId);
    long countByTicketId(Long ticketId);
}