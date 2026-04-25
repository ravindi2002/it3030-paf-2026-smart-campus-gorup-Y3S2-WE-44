package com.smartcampus.api.controller;

import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> create(@Valid @RequestBody CommentDTO dto,
                                          @RequestParam Long userId) {
        CommentDTO created = commentService.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> update(@PathVariable Long id,
                                      @Valid @RequestBody CommentDTO dto,
                                      @RequestParam Long userId) {
        CommentDTO updated = commentService.update(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentDTO>> getByTicketId(@PathVariable Long ticketId) {
        List<CommentDTO> comments = commentService.getByTicketId(ticketId);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                  @RequestParam Long userId) {
        commentService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}