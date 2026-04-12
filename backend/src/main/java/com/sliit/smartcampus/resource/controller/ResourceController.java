package com.sliit.smartcampus.resource.controller;

import com.sliit.smartcampus.common.enums.EquipmentType;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.enums.ResourceType;
import com.sliit.smartcampus.resource.dto.ResourceRequest;
import com.sliit.smartcampus.resource.dto.ResourceResponse;
import com.sliit.smartcampus.resource.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceResponse createResource(@Valid @RequestBody ResourceRequest request) {
        return resourceService.createResource(request);
    }

    @GetMapping
    public List<ResourceResponse> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) EquipmentType equipmentType
    ) {
        if (type != null || status != null || location != null || minCapacity != null || equipmentType != null) {
            return resourceService.searchResources(type, status, location, minCapacity, equipmentType);
        }
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public ResourceResponse getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public ResourceResponse updateResource(@PathVariable Long id,
                                           @Valid @RequestBody ResourceRequest request) {
        return resourceService.updateResource(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
    }
}