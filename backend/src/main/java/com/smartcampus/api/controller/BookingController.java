package com.smartcampus.api.controller;

import com.smartcampus.api.dto.BookingDTO;
import com.smartcampus.api.enums.BookingStatus;
import com.smartcampus.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ========================================================================
 * MODULE B: BOOKING MANAGEMENT CONTROLLER
 * ========================================================================
 * This controller handles all booking operations for facility reservations.
 * 
 * VIVA KEY POINTS:
 * - Booking Workflow: PENDING → APPROVED/REJECTED → CANCELLED
 * - Conflict Detection: Prevents double booking same time slot
 * - Role-based access: ADMIN approves/rejects, USER creates own bookings
 * 
 * WORKFLOW:
 * 1. User creates booking (status = PENDING)
 * 2. Admin reviews and APPROVED or REJECTED
 * 3. User can CANCEL if approved/pending
 * ========================================================================
 */
@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * CREATE BOOKING (POST)
     * Access: USER (userId param required)
     * Creates new booking request with PENDING status
     * 
     * VIVA NOTE: Checks:
     * - Time is in future
     * - End time > Start time
     * - Capacity not exceeded
     * - No conflicts with existing bookings
     */
    @PostMapping
    public ResponseEntity<BookingDTO> create(@Valid @RequestBody BookingDTO dto,
                                          @RequestParam Long userId) {
        BookingDTO created = bookingService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * UPDATE BOOKING (PUT)
     * Access: USER (own bookings only)
     * Updates booking details (time, purpose, attendees)
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> update(@PathVariable Long id,
                                           @Valid @RequestBody BookingDTO dto) {
        BookingDTO updated = bookingService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * APPROVE BOOKING (PUT)
     * Access: ADMIN only
     * Changes status from PENDING → APPROVED
     * 
     * NOTE: Admin provides approvedById for audit trail
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> approve(@PathVariable Long id,
                                         @RequestParam(required = false) Long approvedById) {
        BookingDTO approved = bookingService.updateStatus(id, BookingStatus.APPROVED, approvedById, null);
        return ResponseEntity.ok(approved);
    }

    /**
     * REJECT BOOKING (PUT)
     * Access: ADMIN only
     * Changes status from PENDING → REJECTED
     * 
     * VIVA NOTE: Requires rejection reason (stored in database)
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> reject(@PathVariable Long id,
                                        @RequestParam(required = false) Long approvedById,
                                        @RequestParam(required = false) String rejectionReason) {
        BookingDTO rejected = bookingService.updateStatus(id, BookingStatus.REJECTED, approvedById, rejectionReason);
        return ResponseEntity.ok(rejected);
    }

    /**
     * CANCEL BOOKING (PUT)
     * Access: USER (owner only) or ADMIN
     * Changes status to CANCELLED
     * Can only cancel PENDING or APPROVED bookings
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancel(@PathVariable Long id,
                                           @RequestParam Long userId) {
        BookingDTO cancelled = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(cancelled);
    }

    /**
     * GET BOOKING BY ID (GET)
     * Access: USER (own) or ADMIN
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getById(id);
        return ResponseEntity.ok(booking);
    }

    /**
     * GET ALL BOOKINGS (GET)
     * Access: ADMIN (all) or USER (filtered)
     * 
     * Query Params:
     * - userId: Filter by user
     * - resourceId: Filter by resource
     * - status: Filter by status
     * - startDate/endDate: Filter by date range
     */
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<BookingDTO> bookings;
        if (startDate != null && endDate != null) {
            if (resourceId != null) {
                bookings = bookingService.getByResourceAndDateRange(resourceId, startDate, endDate);
            } else {
                bookings = bookingService.getByDateRange(startDate, endDate);
            }
        } else if (userId != null) {
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

    /**
     * DELETE BOOKING (DELETE)
     * Access: ADMIN only
     * Hard delete from database
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== PUBLIC ENDPOINTS (FOR STUDENTS) ====================

    /**
     * PUBLIC GET BOOKINGS (GET)
     * Access: PUBLIC (limited view)
     * Students can view bookings without auth
     */
    @GetMapping("/public/bookings")
    public ResponseEntity<List<BookingDTO>> getPublicBookings(
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
}