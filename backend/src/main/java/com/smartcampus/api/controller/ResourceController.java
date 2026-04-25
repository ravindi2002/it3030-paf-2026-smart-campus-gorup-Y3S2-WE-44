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

/**
 * ========================================================================
 * MODULE A: FACILITIES & ASSETS CATALOGUE CONTROLLER
 * ========================================================================
 * This controller handles all Resource CRUD operations.
 * It provides both admin and public endpoints for managing university facilities.
 * 
 * VIVA KEY POINTS:
 * - Role-based access: ADMIN/TECHNICIAN can create/update/delete
 * - Public endpoints allow students to view available resources
 * - Search functionality for filtering resources
 * ========================================================================
 */
@RestController
@RequestMapping("/api/admin/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;
    private final UserRepository userRepository;

    /**
     * CREATE NEW RESOURCE (POST)
     * Access: ADMIN, TECHNICIAN only
     * Used to add new lecture halls, labs, meeting rooms, equipment
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> create(@Valid @RequestBody ResourceDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ResourceDTO created = resourceService.create(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * UPDATE RESOURCE (PUT)
     * Access: ADMIN, TECHNICIAN only
     * Updates resource details (name, capacity, location, etc.)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody ResourceDTO dto) {
        ResourceDTO updated = resourceService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * UPDATE RESOURCE STATUS (PATCH)
     * Access: ADMIN, TECHNICIAN only
     * Status change: ACTIVE ↔ OUT_OF_SERVICE
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<ResourceDTO> updateStatus(@PathVariable Long id,
                                            @RequestParam ResourceStatus status) {
        ResourceDTO updated = resourceService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET RESOURCE BY ID (GET)
     * Access: PUBLIC
     * Retrieve specific resource details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getById(@PathVariable Long id) {
        ResourceDTO resource = resourceService.getById(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * GET ALL RESOURCES (GET)
     * Access: PUBLIC (filtered by status if provided)
     * Lists all resources or filtered by status
     */
    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAll(
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceDTO> resources = status != null
                ? resourceService.getByStatus(status)
                : resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    /**
     * SEARCH RESOURCES (GET)
     * Access: PUBLIC
     * Advanced search with filters: name, type, location, capacity
     */
    @GetMapping("/search")
    public ResponseEntity<List<ResourceDTO>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        List<ResourceDTO> resources = resourceService.searchByNameTypeLocation(name, type, location, capacity);
        return ResponseEntity.ok(resources);
    }

    /**
     * DELETE RESOURCE (DELETE)
     * Access: ADMIN only
     * Permanently removes a resource from the system
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== PUBLIC ENDPOINTS FOR STUDENTS ====================

    /**
     * PUBLIC GET RESOURCES (public/GET)
     * Access: PUBLIC (no auth required)
     * Students can view available resources without login
     */
    @GetMapping("/resources")
    public ResponseEntity<List<ResourceDTO>> getPublicResources(
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceDTO> resources = status != null
                ? resourceService.getByStatus(status)
                : resourceService.getAll();
        return ResponseEntity.ok(resources);
    }

    /**
     * PUBLIC SEARCH RESOURCES (GET)
     * Access: PUBLIC (no auth required)
     * Students can search without authentication
     */
    @GetMapping("/resources/search")
    public ResponseEntity<List<ResourceDTO>> searchPublicResources(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        List<ResourceDTO> resources = resourceService.searchByNameTypeLocation(name, type, location, capacity);
        return ResponseEntity.ok(resources);
    }
}