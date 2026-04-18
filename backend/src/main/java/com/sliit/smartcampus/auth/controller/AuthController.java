package com.sliit.smartcampus.auth.controller;

import com.sliit.smartcampus.auth.dto.AuthResponse;
import com.sliit.smartcampus.auth.dto.LoginRequest;
import com.sliit.smartcampus.auth.dto.RegisterRequest;
import com.sliit.smartcampus.auth.security.CustomUserDetails;
import com.sliit.smartcampus.auth.service.AuthService;
import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/oauth2/me")
    public AuthResponse oauth2Me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return AuthResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .message("OAuth2 authenticated user details")
                    .build();
        }

        throw new RuntimeException("Unsupported authenticated principal");
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(RoleType.valueOf(userDetails.getRole()))
                .message("Authenticated user details")
                .build();
    }
}