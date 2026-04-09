package com.sliit.smartcampus.resource.repository;

import com.sliit.smartcampus.common.enums.EquipmentType;
import com.sliit.smartcampus.common.enums.ResourceStatus;
import com.sliit.smartcampus.common.enums.ResourceType;
import com.sliit.smartcampus.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    List<Resource> findByEquipmentType(EquipmentType equipmentType);

    // Search and filter combined
    @Query("SELECT r FROM Resource r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
            "(:equipmentType IS NULL OR r.equipmentType = :equipmentType)")
    List<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity,
            @Param("equipmentType") EquipmentType equipmentType
    );
}