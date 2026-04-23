package com.smartcampus.api.controller;

import com.smartcampus.api.dto.TicketRequestDTO;
import com.smartcampus.api.dto.TicketResponseDTO;
import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.service.TicketService;
import com.smartcampus.api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<TicketResponseDTO> create(@Valid @RequestBody TicketRequestDTO dto,
                                                      @RequestParam Long userId) {
        TicketResponseDTO created = ticketService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody TicketRequestDTO dto) {
        TicketResponseDTO updated = ticketService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> updateStatus(@PathVariable Long id,
                                                         @RequestParam TicketStatus status) {
        TicketResponseDTO updated = ticketService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> assignTicket(@PathVariable Long id,
                                                       @RequestParam Long assignedToId) {
        TicketResponseDTO updated = ticketService.assignTicket(id, assignedToId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponseDTO> resolve(@PathVariable Long id,
                                                   @RequestParam String resolution,
                                                   @RequestParam Long userId) {
        TicketResponseDTO updated = ticketService.resolve(id, resolution, userId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getById(@PathVariable Long id) {
        TicketResponseDTO ticket = ticketService.getById(id);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) TicketStatus status) {
        List<TicketResponseDTO> tickets;
        if (userId != null) {
            tickets = ticketService.getByUserId(userId);
        } else if (status != null) {
            tickets = ticketService.getByStatus(status);
        } else {
            tickets = ticketService.getAll();
        }
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id,
                                              @Valid @RequestBody CommentDTO dto,
                                              @RequestParam Long userId) {
        CommentDTO created = commentService.create(dto, userId);
        ticketService.addCommentToTicket(id, created);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticketService.delete(id);
        return ResponseEntity.noContent().build();
    }
}