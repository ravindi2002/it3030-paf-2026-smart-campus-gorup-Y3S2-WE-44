package com.smartcampus.api.service;

import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.exception.ValidationException;
import com.smartcampus.api.model.Comment;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.User;
import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.repository.CommentRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.dto.NotificationDTO;
import com.smartcampus.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentDTO create(CommentDTO dto, Long userId) {
        Ticket ticket = ticketRepository.findById(dto.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (ticket.getStatus() == com.smartcampus.api.enums.TicketStatus.CLOSED) {
            throw new ValidationException("Cannot add comments to a closed ticket");
        }
        
        Comment comment = Comment.builder()
                .content(dto.getContent())
                .ticket(ticket)
                .user(user)
                .build();
        
        Comment saved = commentRepository.save(comment);
        
        // Send notification to ticket owner about new comment
        sendCommentNotification(ticket, user);
        
        return mapToDTO(saved);
    }

    public CommentDTO update(Long id, CommentDTO dto, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        validateOwnershipOrAdmin(comment, userId);
        
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return mapToDTO(updated);
    }

    public void delete(Long id, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        validateOwnershipOrAdmin(comment, userId);
        
        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void validateOwnershipOrAdmin(Comment comment, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        boolean isOwner = comment.getUser().getId().equals(userId);
        boolean isAdmin = user.getRole() == RoleType.ADMIN;
        
        if (!isOwner && !isAdmin) {
            throw new ValidationException("You can only edit or delete your own comments");
        }
    }

    private CommentDTO mapToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .ticketId(comment.getTicket().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getFullName())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private void sendCommentNotification(Ticket ticket, User commenter) {
        try {
            // Don't notify if the commenter is the ticket owner
            if (ticket.getUser() != null && ticket.getUser().getId().equals(commenter.getId())) {
                return;
            }
            
            String title = "New Comment on Your Ticket";
            String message = String.format("%s commented on your ticket #%d",
                commenter.getFullName(), 
                ticket.getId());

            NotificationDTO notification = NotificationDTO.builder()
                    .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                    .title(title)
                    .message(message)
                    .notificationType("TICKET_COMMENT")
                    .referenceId(ticket.getId())
                    .build();

            notificationService.create(notification);
        } catch (Exception e) {
            System.err.println("Failed to send comment notification: " + e.getMessage());
        }
    }
}