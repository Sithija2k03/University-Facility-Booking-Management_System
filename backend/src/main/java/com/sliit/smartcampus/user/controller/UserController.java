package com.sliit.smartcampus.user.controller;

import com.sliit.smartcampus.user.dto.UserProfileResponseDto;
import com.sliit.smartcampus.user.dto.UserProfileUpdateDto;
import com.sliit.smartcampus.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserProfileResponseDto getMyProfile() {
        return userService.getCurrentUserProfile();
    }

    @PutMapping("/me")
    public UserProfileResponseDto updateMyProfile(@Valid @RequestBody UserProfileUpdateDto dto) {
        return userService.updateCurrentUserProfile(dto);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProfile() {
        userService.deleteCurrentUserProfile();
    }
}