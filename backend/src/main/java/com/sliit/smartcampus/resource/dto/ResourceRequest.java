package com.sliit.smartcampus.resource.dto;

import com.sliit.smartcampus.common.enums.EquipmentType;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ResourceRequest {

    @NotBlank(message = "Resource name is required")
    private String name;

    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private EquipmentType equipmentType;

    @PositiveOrZero(message = "Capacity cannot be negative")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String building;

    private String floor;

    private LocalTime availableFrom;

    private LocalTime availableTo;

    private ResourceStatus status;

    private String imageUrl;
}