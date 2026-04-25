package com.smartcampus.api.controller;

import com.smartcampus.api.dto.TicketRequestDTO;
import com.smartcampus.api.dto.TicketResponseDTO;
import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.model.TicketImage;
import com.smartcampus.api.service.TicketService;
import com.smartcampus.api.service.CommentService;
import com.smartcampus.api.service.TicketImageService;
import com.smartcampus.api.service.QRService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * ========================================================================
 * MODULE C: MAINTENANCE & INCIDENT TICKETING CONTROLLER
 * ========================================================================
 * This controller handles all ticket/incident operations.
 * 
 * VIVA KEY POINTS:
 * - Ticket Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED
 * - Image Attachments: Max 3 images per ticket
 * - Comment System: Users can comment on own tickets
 * - Technician Assignment: ADMIN assigns technician
 * 
 * WORKFLOW:
 * 1. User creates ticket (status = OPEN)
 * 2. Admin assigns technician (status = IN_PROGRESS)
 * 3. Technician resolves (status = RESOLVED)
 * 4. User/Admin closes (status = CLOSED)
 * 5. Admin can REJECT with reason
 * ========================================================================
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;
    private final TicketImageService ticketImageService;
    private final QRService qrService;

    // ========================================================================
    // 🔥 SMART CAMPUS INNOVATION: QR CODE ENDPOINTS
    // ========================================================================
    // VIVA KEY POINTS - QR Code System:
    // 1. Generate unique QR for each ticket
    // 2. Scan to quickly access ticket details
    // 3. Print & stick on equipment for easy reporting
    // 4. "Scan to Report" - auto-fill resource in ticket
    // ========================================================================

    /**
     * CREATE TICKET (POST) - JSON body version
     * Access: USER
     * Creates new incident ticket with OPEN status
     */
    @PostMapping("/create-test")
    public ResponseEntity<TicketResponseDTO> createTestTicket() {
        TicketRequestDTO dto = TicketRequestDTO.builder()
                .title("Demo Issue - Projector Not Working")
                .description("This is a test ticket to demonstrate the QR code functionality.")
                .category("Equipment")
                .priority(com.smartcampus.api.enums.Priority.MEDIUM)
                .location("Lecture Hall A")
                .build();
        
        TicketResponseDTO created = ticketService.create(dto, 1L);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * CREATE TICKET (POST) - JSON body version
     * Access: USER
     * Creates new incident ticket with OPEN status
     */
    @PostMapping
    public ResponseEntity<TicketResponseDTO> createJSON(
            @Valid @RequestBody TicketRequestDTO dto,
            @RequestParam Long userId) {
        TicketResponseDTO created = ticketService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * CREATE TICKET WITH IMAGES (POST) - Multipart FormData version 🔥
     * Access: USER
     * Creates new ticket with image uploads (max 3 files)
     * 
     * VIVA NOTE: This endpoint handles file uploads from frontend
     * Uses @RequestParam for simple fields + @RequestParam for files
     */
    @PostMapping("/with-images")
    public ResponseEntity<TicketResponseDTO> createWithImages(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String priority,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) String preferredContact,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam Long userId) {
        
        // Build DTO from form params
        TicketRequestDTO dto = TicketRequestDTO.builder()
                .title(title)
                .description(description)
                .category(category)
                .priority(com.smartcampus.api.enums.Priority.valueOf(priority))
                .location(location)
                .resourceId(resourceId)
                .preferredContact(preferredContact)
                .build();
        
        // Create ticket
        TicketResponseDTO created = ticketService.create(dto, userId);
        
        // Upload images if provided
        if (images != null && !images.isEmpty()) {
            try {
                for (MultipartFile image : images) {
                    if (image != null && !image.isEmpty()) {
                        ticketImageService.uploadImage(created.getId(), image);
                    }
                }
                // Refresh ticket to get updated images
                created = ticketService.getById(created.getId());
            } catch (Exception e) {
                System.err.println("Image upload error: " + e.getMessage());
            }
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * UPDATE TICKET (PUT)
     * Access: USER (owner only, OPEN tickets)
     * Can update title, description, priority while ticket is OPEN
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody TicketRequestDTO dto) {
        TicketResponseDTO updated = ticketService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * UPDATE TICKET STATUS (PUT)
     * Access: ADMIN, TECHNICIAN
     * Manually updates status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
     * 
     * VIVA NOTE: reason param for REJECTED status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> updateStatus(@PathVariable Long id,
                                                         @RequestParam TicketStatus status,
                                                         @RequestParam(required = false) String reason) {
        TicketResponseDTO updated = ticketService.updateStatus(id, status, reason);
        return ResponseEntity.ok(updated);
    }

    /**
     * ASSIGN TECHNICIAN (PUT)
     * Access: ADMIN only
     * Assigns a technician to the ticket
     * Changes status: OPEN → IN_PROGRESS automatically
     */
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assignTicket(@PathVariable Long id,
                                                           @RequestParam Long assignedToId) {
        TicketResponseDTO updated = ticketService.assignTicket(id, assignedToId);
        return ResponseEntity.ok(updated);
    }

    /**
     * RESOLVE TICKET (PUT)
     * Access: ADMIN, TECHNICIAN
     * Marks ticket as RESOLVED with resolution notes
     * Changes status: IN_PROGRESS → RESOLVED
     */
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> resolve(@PathVariable Long id,
                                                @RequestParam String resolution) {
        TicketResponseDTO updated = ticketService.resolve(id, resolution, null);
        return ResponseEntity.ok(updated);
    }

    /**
     * CLOSE TICKET (PUT)
     * Access: ADMIN, USER
     * Marks resolved ticket as CLOSED
     * Can only close RESOLVED tickets
     */
    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<TicketResponseDTO> close(@PathVariable Long id) {
        TicketResponseDTO updated = ticketService.close(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * REJECT TICKET (PUT)
     * Access: ADMIN only
     * Rejects ticket with reason
     * Changes status: OPEN → REJECTED
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> reject(@PathVariable Long id,
                                                 @RequestParam String reason) {
        TicketResponseDTO updated = ticketService.reject(id, reason);
        return ResponseEntity.ok(updated);
    }

    /**
     * REOPEN TICKET (PUT)
     * Access: ADMIN only
     * Reopens REJECTED or CLOSED tickets
     * Changes status → OPEN
     */
    @PutMapping("/{id}/reopen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> reopen(@PathVariable Long id) {
        TicketResponseDTO updated = ticketService.reopen(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * UPLOAD IMAGES (POST) - Max 3 images
     * Access: USER, ADMIN
     * 
     * VIVA INNOVATION: Image attachments for evidence
     * Constraints:
     * - Max 3 images per ticket
     * - Max 5MB per image
     * - Only image types (jpg, png, etc.)
     */
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<TicketImage>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        
        if (files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }
        
        List<TicketImage> images = files.stream()
                .map(file -> ticketImageService.uploadImage(id, file))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(images);
    }

    /**
     * GET IMAGES (GET)
     * Access: USER, ADMIN
     * Retrieves all images for a ticket
     */
    @GetMapping("/{id}/images")
    public ResponseEntity<List<TicketImage>> getImages(@PathVariable Long id) {
        List<TicketImage> images = ticketImageService.getImagesByTicketId(id);
        return ResponseEntity.ok(images);
    }

    /**
     * DELETE IMAGE (DELETE)
     * Access: USER, ADMIN
     * Deletes a specific ticket image
     */
    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        ticketImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

    // ========================================================================
    // 🔥 QR CODE ENDPOINTS - Smart Campus Innovation
    // ========================================================================

    /**
     * GET TICKET QR CODE (GET) 🔥 INNOVATION
     * Access: PUBLIC (no auth needed for quick access)
     * 
     * VIVA EXPLANATION:
     * - Generates unique QR code for each ticket
     * - QR points to: http://localhost:5173/tickets/{id}
     * - Can be scanned to quickly access ticket
     * - Print & stick on equipment for easy access
     * 
     * Use cases:
     * 1. Print QR and stick on lab equipment
     * 2. Technician scans → open ticket instantly
     * 3. Track status without logging in
     */
    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getTicketQR(@PathVariable Long id) throws Exception {
        // Verify ticket exists first
        ticketService.getById(id);
        
        byte[] qrImage = qrService.generateQRForTicket(id);
        
        return ResponseEntity.ok()
                .header("Content-Type", "image/png")
                .header("Content-Disposition", "inline; filename=ticket-" + id + ".png")
                .body(qrImage);
    }

    /**
     * GET RESOURCE QR CODE (GET) 🔥 SCAN TO REPORT
     * Access: ADMIN only (generate for resources)
     * 
     * VIVA INNOVATION - "Scan to Report Issue":
     * - Generate QR for each resource (lab, projector, room)
     * - Stick QR on equipment
     * - Anyone scans → opens create ticket page
     * - Resource auto-selected in form!
     * - Zero manual input needed!
     * 
     * URL format: http://localhost:5173/tickets/create?resourceId={id}
     */
    @GetMapping("/resources/{resourceId}/qr")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> getResourceQR(@PathVariable Long resourceId) throws Exception {
        byte[] qrImage = qrService.generateQRForResource(resourceId);
        
        return ResponseEntity.ok()
                .header("Content-Type", "image/png")
                .header("Content-Disposition", "inline; filename=resource-" + resourceId + ".png")
                .body(qrImage);
    }

    /**
     * PUBLIC TICKET VIEW (GET) - Accessed via QR scan
     * Access: PUBLIC (no auth needed)
     * 
     * VIVA NOTE: This is the page users see when they scan QR
     * Shows ticket details without login!
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<TicketResponseDTO> getPublicTicket(@PathVariable Long id) {
        TicketResponseDTO ticket = ticketService.getById(id);
        return ResponseEntity.ok(ticket);
    }

    /**
     * GET TICKET BY ID (GET)
     * Access: USER, ADMIN, TECHNICIAN
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getById(@PathVariable Long id) {
        TicketResponseDTO ticket = ticketService.getById(id);
        return ResponseEntity.ok(ticket);
    }

    /**
     * GET ALL TICKETS (GET)
     * Access: ADMIN (all) or USER (filtered)
     * 
     * Query Params:
     * - userId: Filter by reporter
     * - status: Filter by status
     * - assignedToId: Filter by assigned technician
     */
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Long assignedToId) {
        List<TicketResponseDTO> tickets;
        
        if (userId != null) {
            tickets = ticketService.getByUserId(userId);
        } else if (status != null) {
            tickets = ticketService.getByStatus(status);
        } else if (assignedToId != null) {
            tickets = ticketService.getByAssignedToId(assignedToId);
        } else {
            tickets = ticketService.getAll();
        }
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET TECHNICIAN TICKETS (GET)
     * Access: TECHNICIAN, ADMIN
     * Gets tickets assigned to specific technician
     */
    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponseDTO>> getTechnicianTickets(@PathVariable Long technicianId) {
        List<TicketResponseDTO> tickets = ticketService.getAssignedTicketsForTechnician(technicianId);
        return ResponseEntity.ok(tickets);
    }

    /**
     * ADD COMMENT (POST)
     * Access: USER, ADMIN, TECHNICIAN
     * 
     * VIVA NOTE: Comment ownership rules:
     * - User can edit/delete own comments
     * - ADMIN can edit/delete any comment
     * - Cannot comment on CLOSED tickets
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id,
                                               @Valid @RequestBody CommentDTO dto,
                                               @RequestParam Long userId) {
        dto.setTicketId(id);
        CommentDTO created = commentService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * UPDATE COMMENT (PUT)
     * Access: Comment owner or ADMIN
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long commentId,
                                              @Valid @RequestBody CommentDTO dto,
                                              @RequestParam Long userId) {
        CommentDTO updated = commentService.update(commentId, dto, userId);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE COMMENT (DELETE)
     * Access: Comment owner or ADMIN
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                          @RequestParam Long userId) {
        commentService.delete(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET COMMENTS (GET)
     * Access: USER, ADMIN
     * Gets all comments for a specific ticket
     */
    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long ticketId) {
        List<CommentDTO> comments = commentService.getByTicketId(ticketId);
        return ResponseEntity.ok(comments);
    }

    /**
     * DELETE TICKET (DELETE)
     * Access: ADMIN only
     * Permanently removes ticket
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticketService.delete(id);
        return ResponseEntity.noContent().build();
    }
}