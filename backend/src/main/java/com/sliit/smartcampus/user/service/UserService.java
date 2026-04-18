package com.sliit.smartcampus.user.service;

import com.sliit.smartcampus.auth.security.SecurityUtils;
import com.sliit.smartcampus.common.exception.UnauthorizedAccessException;
import com.sliit.smartcampus.user.dto.UserProfileResponseDto;
import com.sliit.smartcampus.user.dto.UserProfileUpdateDto;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserProfileResponseDto getCurrentUserProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponseDto updateCurrentUserProfile(UserProfileUpdateDto dto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName().trim());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (user.getPassword() == null) {
                throw new UnauthorizedAccessException("This account does not support local password update");
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        User updated = userRepository.save(user);
        return mapToProfileResponse(updated);
    }

    @Transactional
    public void deleteCurrentUserProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    private UserProfileResponseDto mapToProfileResponse(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider() != null ? user.getProvider().name() : null)
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}