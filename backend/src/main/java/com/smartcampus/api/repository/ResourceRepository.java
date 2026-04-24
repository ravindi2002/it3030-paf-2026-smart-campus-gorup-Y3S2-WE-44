package com.smartcampus.api.repository;

import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByNameContainingIgnoreCase(String name);
    List<Resource> findByCreatedById(Long userId);
    @Query("""
        SELECT r FROM Resource r
        WHERE (:type IS NULL OR LOWER(r.resourceType) LIKE LOWER(CONCAT('%', :type, '%')))
        AND (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:capacity IS NULL OR r.capacity >= :capacity)
        """)
    List<Resource> search(String type, String location, Integer capacity);
}