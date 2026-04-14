package com.sliit.smartcampus.notification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {

    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private String type;
    private Long referenceId;
    private LocalDateTime createdAt;
}