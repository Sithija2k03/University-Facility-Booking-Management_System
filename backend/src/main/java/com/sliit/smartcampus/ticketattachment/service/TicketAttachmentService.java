package com.sliit.smartcampus.ticketattachment.service;

import com.sliit.smartcampus.common.exception.InvalidFileException;
import com.sliit.smartcampus.common.exception.TicketAttachmentNotFoundException;
import com.sliit.smartcampus.common.exception.TicketNotFoundException;
import com.sliit.smartcampus.ticket.entity.Ticket;
import com.sliit.smartcampus.ticket.repository.TicketRepository;
import com.sliit.smartcampus.ticketattachment.dto.TicketAttachmentResponseDto;
import com.sliit.smartcampus.ticketattachment.entity.TicketAttachment;
import com.sliit.smartcampus.ticketattachment.repository.TicketAttachmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class TicketAttachmentService {

    private final TicketAttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public TicketAttachmentService(
            TicketAttachmentRepository attachmentRepository,
            TicketRepository ticketRepository
    ) {
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
    }

    public TicketAttachmentResponseDto uploadAttachment(Long ticketId, MultipartFile file) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found with id: " + ticketId));

        long existingCount = attachmentRepository.countByTicketId(ticketId);
        if (existingCount >= 3) {
            throw new InvalidFileException("A ticket can only have up to 3 image attachments");
        }

        validateFile(file);

        try {
            String ticketFolder = uploadDir + "/tickets/" + ticketId;
            Path uploadPath = Paths.get(ticketFolder);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String extension = getFileExtension(originalFileName);
            String storedFileName = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            TicketAttachment attachment = TicketAttachment.builder()
                    .ticket(ticket)
                    .originalFileName(originalFileName)
                    .storedFileName(storedFileName)
                    .filePath(filePath.toString())
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();

            TicketAttachment saved = attachmentRepository.save(attachment);

            return mapToResponse(saved);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public List<TicketAttachmentResponseDto> getAttachmentsByTicketId(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteAttachment(Long attachmentId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new TicketAttachmentNotFoundException("Attachment not found with id: " + attachmentId));

        try {
            Path path = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from disk: " + e.getMessage());
        }

        attachmentRepository.delete(attachment);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileException("Only image files are allowed");
        }

        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new InvalidFileException("File size must not exceed 5MB");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private TicketAttachmentResponseDto mapToResponse(TicketAttachment attachment) {
        return TicketAttachmentResponseDto.builder()
                .id(attachment.getId())
                .ticketId(attachment.getTicket().getId())
                .originalFileName(attachment.getOriginalFileName())
                .storedFileName(attachment.getStoredFileName())
                .contentType(attachment.getContentType())
                .fileSize(attachment.getFileSize())
                .filePath(attachment.getFilePath())
                .build();
    }
}