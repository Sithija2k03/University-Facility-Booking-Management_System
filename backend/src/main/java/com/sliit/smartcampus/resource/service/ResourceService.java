package com.sliit.smartcampus.resource.service;

import com.sliit.smartcampus.common.enums.EquipmentType;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.enums.ResourceType;
import com.sliit.smartcampus.common.exception.BadRequestException;
import com.sliit.smartcampus.common.exception.ResourceNotFoundException;
import com.sliit.smartcampus.resource.dto.ResourceRequest;
import com.sliit.smartcampus.resource.dto.ResourceResponse;
import com.sliit.smartcampus.resource.entity.Resource;
import com.sliit.smartcampus.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceResponse createResource(ResourceRequest request) {
        validateResourceRequest(request);

        Resource resource = Resource.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .equipmentType(request.getEquipmentType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .building(request.getBuilding())
                .floor(request.getFloor())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .status(request.getStatus() != null ? request.getStatus() : ResourceStatus.ACTIVE)
                .imageUrl(request.getImageUrl())
                .build();

        return mapToResponse(resourceRepository.save(resource));
    }

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResourceResponse getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        return mapToResponse(resource);
    }

    public ResourceResponse updateResource(Long id, ResourceRequest request) {
        validateResourceRequest(request);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
        resource.setType(request.getType());
        resource.setEquipmentType(request.getEquipmentType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setBuilding(request.getBuilding());
        resource.setFloor(request.getFloor());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(request.getStatus() != null ? request.getStatus() : resource.getStatus());
        resource.setImageUrl(request.getImageUrl());

        return mapToResponse(resourceRepository.save(resource));
    }

    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.delete(resource);
    }

    public List<ResourceResponse> searchResources(ResourceType type,
                                                  ResourceStatus status,
                                                  String location,
                                                  Integer minCapacity,
                                                  EquipmentType equipmentType) {

        List<Resource> resources = resourceRepository.findAll();

        List<Resource> filtered = resources.stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> location == null || location.isBlank() ||
                        (r.getLocation() != null &&
                                r.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(r -> minCapacity == null ||
                        (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> equipmentType == null || r.getEquipmentType() == equipmentType)
                .toList();

        return filtered.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void validateResourceRequest(ResourceRequest request) {
        if (request.getType() == ResourceType.EQUIPMENT) {
            if (request.getEquipmentType() == null) {
                throw new BadRequestException("Equipment type is required when resource type is EQUIPMENT");
            }
        } else {
            if (request.getCapacity() == null || request.getCapacity() <= 0) {
                throw new BadRequestException("Capacity is required and must be greater than 0 for non-equipment resources");
            }
            if (request.getEquipmentType() != null) {
                throw new BadRequestException("Equipment type should only be provided when resource type is EQUIPMENT");
            }
        }

        if (request.getAvailableFrom() != null && request.getAvailableTo() != null) {
            if (!request.getAvailableFrom().isBefore(request.getAvailableTo())) {
                throw new BadRequestException("availableFrom must be earlier than availableTo");
            }
        }
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .description(resource.getDescription())
                .type(resource.getType())
                .equipmentType(resource.getEquipmentType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .building(resource.getBuilding())
                .floor(resource.getFloor())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .imageUrl(resource.getImageUrl())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
