package com.sliit.smartcampus.user.controller;

import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.dto.UserProfileResponseDto;
import com.sliit.smartcampus.user.dto.UserProfileUpdateDto;
import com.sliit.smartcampus.user.dto.UserSummaryDto;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import com.sliit.smartcampus.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    // 🔹 EXISTING — get users by role
    @GetMapping("/role/{role}")
    public List<UserSummaryDto> getUsersByRole(@PathVariable RoleType role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    // 🔹 NEW — GET CURRENT USER PROFILE
    @GetMapping("/me")
    public UserProfileResponseDto getCurrentUserProfile() {
        return userService.getCurrentUserProfile();
    }

    // 🔹 NEW — UPDATE PROFILE
    @PutMapping("/me")
    public UserProfileResponseDto updateCurrentUserProfile(
            @Valid @RequestBody UserProfileUpdateDto dto
    ) {
        return userService.updateCurrentUserProfile(dto);
    }

    // 🔹 NEW — DELETE PROFILE
    @DeleteMapping("/me")
    public void deleteCurrentUserProfile() {
        userService.deleteCurrentUserProfile();
    }

    // 🔹 Helper
    private UserSummaryDto toSummary(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}