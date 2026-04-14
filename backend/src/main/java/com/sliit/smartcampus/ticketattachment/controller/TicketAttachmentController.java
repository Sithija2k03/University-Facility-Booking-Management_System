package com.sliit.smartcampus.ticketattachment.controller;

import com.sliit.smartcampus.ticketattachment.dto.TicketAttachmentResponseDto;
import com.sliit.smartcampus.ticketattachment.service.TicketAttachmentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
public class TicketAttachmentController {

    private final TicketAttachmentService attachmentService;

    public TicketAttachmentController(TicketAttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TicketAttachmentResponseDto uploadAttachment(
            @PathVariable Long ticketId,
            @RequestPart("file") MultipartFile file
    ) {
        return attachmentService.uploadAttachment(ticketId, file);
    }

    @GetMapping
    public List<TicketAttachmentResponseDto> getAttachments(@PathVariable Long ticketId) {
        return attachmentService.getAttachmentsByTicketId(ticketId);
    }

    @DeleteMapping("/{attachmentId}")
    public String deleteAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId
    ) {
        attachmentService.deleteAttachment(attachmentId);
        return "Attachment deleted successfully";
    }
}