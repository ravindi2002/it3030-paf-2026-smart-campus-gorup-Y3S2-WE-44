package com.smartcampus.api.controller;

import com.smartcampus.api.dto.UserDTO;
import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.enums.StaffAvailability;
import com.smartcampus.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO dto) {
        UserDTO created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserDTO> update(@PathVariable Long id,
                                          @Valid @RequestBody UserDTO dto) {
        UserDTO updated = userService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long id,
                                             @RequestParam RoleType role) {
        UserDTO updated = userService.updateRole(id, role);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<UserDTO> updateAvailability(@PathVariable Long id,
                                                @RequestParam StaffAvailability availability) {
        UserDTO updated = userService.updateAvailability(id, availability);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserDTO> updatePassword(@PathVariable Long id,
                                                @RequestParam String newPassword) {
        UserDTO updated = userService.updatePassword(id, newPassword);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        UserDTO user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAll(@RequestParam(required = false) RoleType role) {
        List<UserDTO> users = role != null
                ? userService.getByRole(role)
                : userService.getAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/staff/available")
    public ResponseEntity<List<UserDTO>> getAvailableStaff() {
        List<UserDTO> users = userService.getByRole(RoleType.TECHNICIAN);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}