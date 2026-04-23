package com.smartcampus.api.controller;

import com.smartcampus.api.dto.ResourceDTO;
import com.smartcampus.api.enums.ResourceStatus;
import com.smartcampus.api.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> create(@Valid @RequestBody ResourceDTO dto,
                                          @RequestParam Long userId) {
        ResourceDTO created = resourceService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody ResourceDTO dto) {
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
}