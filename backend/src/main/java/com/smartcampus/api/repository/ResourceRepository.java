package com.smartcampus.api.repository;

import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByNameContainingIgnoreCase(String name);
    List<Resource> findByCreatedById(Long userId);
}