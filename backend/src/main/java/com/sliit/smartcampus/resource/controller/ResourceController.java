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
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceResponse createResource(
            @RequestPart("resource") @Valid ResourceRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return resourceService.createResource(request, imageFile);
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

    // Optional alias so frontend can also call /api/resources/search
    @GetMapping("/search")
    public List<ResourceResponse> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) EquipmentType equipmentType
    ) {
        return resourceService.searchResources(type, status, location, minCapacity, equipmentType);
    }

    @GetMapping("/id/{id}")
    public ResourceResponse getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResourceResponse updateResource(
            @PathVariable Long id,
            @RequestPart("resource") @Valid ResourceRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return resourceService.updateResource(id, request, imageFile);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
    }
}