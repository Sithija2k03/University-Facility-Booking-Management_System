package com.sliit.smartcampus.user.controller;

import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.dto.UserSummaryDto;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/role/{role}")
    public List<UserSummaryDto> getUsersByRole(@PathVariable RoleType role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    private UserSummaryDto toSummary(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
