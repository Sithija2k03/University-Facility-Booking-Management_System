package com.sliit.smartcampus.analytics.controller;

import com.sliit.smartcampus.analytics.dto.AnalyticsResponse;
import com.sliit.smartcampus.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/admin")
    public AnalyticsResponse getAdminAnalytics() {
        return analyticsService.getAdminAnalytics();
    }
}