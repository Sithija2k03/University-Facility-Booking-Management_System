package com.sliit.smartcampus.auth.dto;

import com.sliit.smartcampus.common.enums.AuthProvider;
import com.sliit.smartcampus.common.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private RoleType role;
    private AuthProvider provider;
    private Boolean emailVerified;
    private Boolean accountEnabled;
    private String message;
}