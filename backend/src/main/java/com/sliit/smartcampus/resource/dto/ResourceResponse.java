package com.sliit.smartcampus.resource.dto;
import com.sliit.smartcampus.common.enums.EquipmentType;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class ResourceResponse {

    private Long id;
    private String name;
    private String description;
    private ResourceType type;
    private EquipmentType equipmentType;
    private Integer capacity;
    private String location;
    private String building;
    private String floor;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}