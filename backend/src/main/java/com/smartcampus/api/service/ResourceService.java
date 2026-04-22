package com.smartcampus.api.service;

import com.smartcampus.api.dto.ResourceDTO;
import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public ResourceDTO create(ResourceDTO dto, Long userId) {
        User user = userRepository.findById(userId)
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

    public ResourceDTO update(Long id, ResourceDTO dto) {
        Resource resource = resourceRepository.findById(id)
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

    public ResourceDTO updateStatus(Long id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        resource.setStatus(status);
        Resource updated = resourceRepository.save(resource);
        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public ResourceDTO getById(Long id) {
        Resource resource = resourceRepository.findById(id)
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
        List<Resource> resources = resourceRepository.findAll();
        return resources.stream()
                .filter(r -> type == null || (r.getResourceType() != null && r.getResourceType().equalsIgnoreCase(type)))
                .filter(r -> location == null || (r.getLocation() != null && r.getLocation().toLowerCase().contains(location.toLowerCase())))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found");
        }
        resourceRepository.deleteById(id);
    }

    private ResourceDTO mapToDTO(Resource resource) {
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