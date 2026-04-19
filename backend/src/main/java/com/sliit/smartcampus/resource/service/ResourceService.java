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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ResourceResponse createResource(ResourceRequest request, MultipartFile imageFile) {
        validateResourceRequest(request);

        String savedImagePath = saveResourceImage(imageFile);

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
                .imageUrl(savedImagePath)
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

    public ResourceResponse updateResource(Long id, ResourceRequest request, MultipartFile imageFile) {
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

        if (imageFile != null && !imageFile.isEmpty()) {
            deletePhysicalFileIfExists(resource.getImageUrl());
            String savedImagePath = saveResourceImage(imageFile);
            resource.setImageUrl(savedImagePath);
        }

        return mapToResponse(resourceRepository.save(resource));
    }

    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        deletePhysicalFileIfExists(resource.getImageUrl());
        resourceRepository.delete(resource);
    }

    public List<ResourceResponse> searchResources(ResourceType type,
                                                  ResourceStatus status,
                                                  String location,
                                                  Integer minCapacity,
                                                  EquipmentType equipmentType) {
        return resourceRepository.findAll().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> location == null || location.isBlank() ||
                        (r.getLocation() != null &&
                                r.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(r -> minCapacity == null ||
                        (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> equipmentType == null || r.getEquipmentType() == equipmentType)
                .map(this::mapToResponse)
                .toList();
    }

    private void validateResourceRequest(ResourceRequest request) {
        if (request.getType() == ResourceType.EQUIPMENT) {
            if (request.getEquipmentType() == null) {
                throw new BadRequestException("Equipment type is required when resource type is EQUIPMENT");
            }
            if (request.getCapacity() != null && request.getCapacity() <= 0) {
                throw new BadRequestException("Capacity must be greater than 0 if provided");
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

    private String saveResourceImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed for resource image upload");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Image size must not exceed 5MB");
        }

        try {
            Path uploadPath = Paths.get(uploadDir, "resources");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String storedFileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "uploads/resources/" + storedFileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store resource image: " + e.getMessage());
        }
    }

    private void deletePhysicalFileIfExists(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return;
        }

        // Skip deletion if the stored value is a URL (placeholder data from seeding)
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            return;
        }

        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        } catch (Exception e) {
            // Log but don't throw — image cleanup failure should not block resource deletion
            System.err.println("Warning: could not delete image file: " + filePath + " — " + e.getMessage());
        }
    }
}