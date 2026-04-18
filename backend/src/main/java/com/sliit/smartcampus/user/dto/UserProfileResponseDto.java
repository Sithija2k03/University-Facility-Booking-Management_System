package com.sliit.smartcampus.user.dto;

import com.sliit.smartcampus.common.enums.RoleType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponseDto {
    private Long id;
    private String name;
    private String email;
    private RoleType role;
    private String provider;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}