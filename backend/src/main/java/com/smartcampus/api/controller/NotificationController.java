package com.smartcampus.api.controller;

import com.smartcampus.api.dto.NotificationDTO;
import com.smartcampus.api.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ========================================================================
 * MODULE D: NOTIFICATIONS CONTROLLER
 * ========================================================================
 * This controller handles notification delivery for users.
 * 
 * VIVA KEY POINTS:
 * 
 * NOTIFICATION TYPES:
 * - BOOKING_APPROVED: When admin approves booking
 * - BOOKING_REJECTED: When admin rejects booking
 * - TICKET_STATUS: When ticket status changes
 * - NEW_COMMENT: When someone comments on user's ticket
 * - TICKET_ASSIGNED: When technician is assigned
 * 
 * NOTIFICATION WORKFLOW:
 * 1. Event happens (booking approved, etc.)
 * 2. Service creates notification record
 * 3. User sees notification in UI
 * 4. User marks as read when viewed
 * ========================================================================
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * CREATE NOTIFICATION (POST)
     * Access: System/Admin only
     * Used internally when events happen
     */
    @PostMapping
    public ResponseEntity<NotificationDTO> create(@Valid @RequestBody NotificationDTO dto) {
        NotificationDTO created = notificationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * MARK AS READ (PUT)
     * Access: USER (own notifications)
     * User clicks to mark notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        NotificationDTO updated = notificationService.markAsRead(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET ALL NOTIFICATIONS (GET)
     * Access: USER (own notifications)
     * Returns all notifications for a user, newest first
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAll(@RequestParam Long userId) {
        List<NotificationDTO> notifications = notificationService.getByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET USER NOTIFICATIONS (GET)
     * Access: USER (own notifications)
     * Alternative endpoint with userId in path
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getByUserId(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET UNREAD NOTIFICATIONS (GET)
     * Access: USER (own notifications)
     * Returns only unread notifications
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadByUserId(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET UNREAD COUNT (GET)
     * Access: USER (own notifications)
     * Returns count of unread notifications (for badge display)
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * DELETE NOTIFICATION (DELETE)
     * Access: USER (own notifications)
     * Remove notification after reading or manual delete
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}