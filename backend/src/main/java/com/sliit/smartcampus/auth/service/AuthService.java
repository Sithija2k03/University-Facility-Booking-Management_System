package com.sliit.smartcampus.auth.service;

import com.sliit.smartcampus.auth.dto.AuthResponse;
import com.sliit.smartcampus.auth.dto.LoginRequest;
import com.sliit.smartcampus.auth.dto.RegisterRequest;
import com.sliit.smartcampus.common.enums.AuthProvider;
import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.common.exception.AccountDisabledException;
import com.sliit.smartcampus.common.exception.InvalidCredentialsException;
import com.sliit.smartcampus.common.exception.UserAlreadyExistsException;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        String name = request.getName().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("An account with this email already exists");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.USER)
                .provider(AuthProvider.LOCAL)
                .emailVerified(false)
                .accountEnabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return buildResponse(savedUser, "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getAccountEnabled())) {
            throw new AccountDisabledException("Your account has been disabled");
        }

        if (user.getPassword() == null) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return buildResponse(user, "Login successful");
    }

    private AuthResponse buildResponse(User user, String message) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .emailVerified(user.getEmailVerified())
                .accountEnabled(user.getAccountEnabled())
                .message(message)
                .build();
    }
}