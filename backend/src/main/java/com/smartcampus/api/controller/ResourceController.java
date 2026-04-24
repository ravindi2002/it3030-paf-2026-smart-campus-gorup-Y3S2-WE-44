package com.smartcampus.api.controller;

import com.smartcampus.api.dto.ResourceDTO;
import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> create(@Valid @RequestBody ResourceDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ResourceDTO created = resourceService.create(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Temporary test endpoint without role restrictions
    @PostMapping("/test")
    public ResponseEntity<ResourceDTO> createTest(@Valid @RequestBody ResourceDTO dto, Authentication authentication) {
        System.out.println("DEBUG: Creating resource with user: " + (authentication != null ? authentication.getName() : "null"));
        System.out.println("DEBUG: User authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
        
        if (authentication != null) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            ResourceDTO created = resourceService.create(dto, user.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } else {
            throw new RuntimeException("Authentication is null");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody ResourceDTO dto) {
        ResourceDTO updated = resourceService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    // Temporary test endpoint without role restrictions
    @PutMapping("/{id}/test")
    public ResponseEntity<ResourceDTO> updateTest(@PathVariable Long id,
                                                 @Valid @RequestBody ResourceDTO dto, Authentication authentication) {
        System.out.println("DEBUG: Updating resource " + id + " with user: " + (authentication != null ? authentication.getName() : "null"));
        System.out.println("DEBUG: User authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
        System.out.println("DEBUG: Resource data: " + dto);
        
        ResourceDTO updated = resourceService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> updateStatus(@PathVariable Long id,
                                                    @RequestParam ResourceStatus status) {
        ResourceDTO updated = resourceService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // Temporary test endpoint without role restrictions
    @PatchMapping("/{id}/status/test")
    public ResponseEntity<ResourceDTO> updateStatusTest(@PathVariable Long id,
                                                       @RequestParam ResourceStatus status, Authentication authentication) {
        System.out.println("DEBUG: Updating status for resource " + id + " to " + status + " with user: " + (authentication != null ? authentication.getName() : "null"));
        System.out.println("DEBUG: User authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
        
        ResourceDTO updated = resourceService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getById(@PathVariable Long id) {
        ResourceDTO resource = resourceService.getById(id);
        return ResponseEntity.ok(resource);
    }

    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAll(
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceDTO> resources = status != null
                ? resourceService.getByStatus(status)
                : resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceDTO>> search(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location) {
        List<ResourceDTO> resources = resourceService.search(type, location);
        return ResponseEntity.ok(resources);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Public endpoints for students - /api/resources
    @GetMapping("/resources")
    public ResponseEntity<List<ResourceDTO>> getPublicResources(
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceDTO> resources = status != null
                ? resourceService.getByStatus(status)
                : resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/resources/search")
    public ResponseEntity<List<ResourceDTO>> searchPublicResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        List<ResourceDTO> resources = resourceService.search(type, location, capacity);
        return ResponseEntity.ok(resources);
    }

    // Legacy public endpoint
    @GetMapping("/public/resources")
    public ResponseEntity<List<ResourceDTO>> getPublicResourcesLegacy(
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceDTO> resources = status != null
                ? resourceService.getByStatus(status)
                : resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/public/resources/search")
    public ResponseEntity<List<ResourceDTO>> searchPublicResourcesLegacy(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location) {
        List<ResourceDTO> resources = resourceService.search(type, location, null);
        return ResponseEntity.ok(resources);
    }
}