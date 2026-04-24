package com.smartcampus.api.service;

import com.smartcampus.api.dto.ResourceDTO;
import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.repository.BookingRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    @NonNull
    private final ResourceRepository resourceRepository;
    @NonNull
    private final UserRepository userRepository;
    @NonNull
    private final BookingRepository bookingRepository;

    @SuppressWarnings("nullness")
    public ResourceDTO create(@NonNull ResourceDTO dto, @NonNull Long userId) {
        @NonNull User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Resource resource = Resource.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .resourceType(dto.getResourceType())
                .status(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE)
                .imageUrl(dto.getImageUrl())
                .capacity(dto.getCapacity())
                .createdBy(user)
                .build();
        
        Resource saved = resourceRepository.save(resource);
        return mapToDTO(saved);
    }

    @SuppressWarnings("nullness")
    public ResourceDTO update(@NonNull Long id, @NonNull ResourceDTO dto) {
        @NonNull Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        
        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());
        resource.setLocation(dto.getLocation());
        resource.setResourceType(dto.getResourceType());
        if (dto.getStatus() != null) {
            resource.setStatus(dto.getStatus());
        }
        resource.setImageUrl(dto.getImageUrl());
        resource.setCapacity(dto.getCapacity());
        
        Resource updated = resourceRepository.save(resource);
        return mapToDTO(updated);
    }

    @SuppressWarnings("nullness")
    public ResourceDTO updateStatus(@NonNull Long id, @NonNull ResourceStatus status) {
        @NonNull Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        // Allow status changes for all resources (including OUT_OF_SERVICE)
        resource.setStatus(status);
        Resource updated = resourceRepository.save(resource);
        return mapToDTO(updated);
    }

    @SuppressWarnings("nullness")
    @Transactional(readOnly = true)
    public ResourceDTO getById(@NonNull Long id) {
        @NonNull Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return mapToDTO(resource);
    }

    @Transactional(readOnly = true)
    public List<ResourceDTO> getAll() {
        return resourceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceDTO> getByStatus(ResourceStatus status) {
        return resourceRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceDTO> search(String type, String location) {
        return resourceRepository
                .search(type, location)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("nullness")
    public void delete(@NonNull Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found");
        }
        resourceRepository.deleteById(id);
    }

    /**
     * 🔥 SMART CAMPUS AUTO STATUS UPDATER
     * This is the core "Smart Campus" feature that automatically manages resource availability
     * based on active bookings. Runs every minute to check and update resource status.
     */
    @Scheduled(fixedRate = 60000) // Every 1 minute
    @Transactional
    public void autoUpdateResourceStatus() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<Resource> resources = resourceRepository.findAll();

        for (Resource resource : resources) {
            // Skip OUT_OF_SERVICE resources - they should never be auto-updated
            if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
                continue;
            }

            // Check if there's an active booking for this resource right now
            boolean hasActiveBooking = bookingRepository.existsActiveBooking(resource.getId(), currentTime);

            if (hasActiveBooking) {
                // Resource is currently being used - keep as ACTIVE (no change needed)
                // Status remains ACTIVE when in use
            } else {
                // No active booking - ensure status is ACTIVE
                if (resource.getStatus() != ResourceStatus.ACTIVE) {
                    resource.setStatus(ResourceStatus.ACTIVE);
                    resourceRepository.save(resource);
                }
            }
        }
    }

    @SuppressWarnings("nullness")
    private ResourceDTO mapToDTO(@NonNull Resource resource) {
        return ResourceDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .description(resource.getDescription())
                .location(resource.getLocation())
                .resourceType(resource.getResourceType())
                .status(resource.getStatus())
                .imageUrl(resource.getImageUrl())
                .capacity(resource.getCapacity())
                .createdById(resource.getCreatedBy() != null ? resource.getCreatedBy().getId() : null)
                .createdByName(resource.getCreatedBy() != null ? resource.getCreatedBy().getFullName() : null)
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}