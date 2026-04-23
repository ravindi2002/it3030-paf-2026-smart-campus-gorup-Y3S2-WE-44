package com.smartcampus.api.controller;

import com.smartcampus.api.dto.BookingDTO;
import com.smartcampus.api.enums.BookingStatus;
import com.smartcampus.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> create(@Valid @RequestBody BookingDTO dto,
                                              @RequestParam Long userId) {
        BookingDTO created = bookingService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody BookingDTO dto) {
        BookingDTO updated = bookingService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> approve(@PathVariable Long id,
                                              @RequestParam(required = false) Long approvedById) {
        BookingDTO approved = bookingService.updateStatus(id, BookingStatus.APPROVED, approvedById);
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> reject(@PathVariable Long id,
                                              @RequestParam(required = false) Long approvedById) {
        BookingDTO rejected = bookingService.updateStatus(id, BookingStatus.REJECTED, approvedById);
        return ResponseEntity.ok(rejected);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) BookingStatus status) {
        List<BookingDTO> bookings;
        if (userId != null) {
            bookings = bookingService.getByUserId(userId);
        } else if (resourceId != null) {
            bookings = bookingService.getByResourceId(resourceId);
        } else if (status != null) {
            bookings = bookingService.getByStatus(status);
        } else {
            bookings = bookingService.getAll();
        }
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}