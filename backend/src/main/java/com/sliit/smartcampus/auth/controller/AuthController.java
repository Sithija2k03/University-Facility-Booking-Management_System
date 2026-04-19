package com.sliit.smartcampus.auth.controller;

import com.sliit.smartcampus.auth.dto.AuthResponse;
import com.sliit.smartcampus.auth.dto.LoginRequest;
import com.sliit.smartcampus.auth.dto.RegisterRequest;
import com.sliit.smartcampus.auth.service.AuthService;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        return resolveAuthenticatedUser(authentication);
    }

    @GetMapping("/oauth2/me")
    public ResponseEntity<AuthResponse> getCurrentOAuth2User(Authentication authentication) {
        return resolveAuthenticatedUser(authentication);
    }

    private ResponseEntity<AuthResponse> resolveAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email;

        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
        } else if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = authentication.getName();
        }

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .message("Authenticated")
                .build();

        return ResponseEntity.ok(response);
    }
}