package com.smartcampus.api.service;

import com.smartcampus.api.dto.TicketRequestDTO;
import com.smartcampus.api.dto.TicketResponseDTO;
import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.exception.ValidationException;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.dto.NotificationDTO;
import com.smartcampus.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final Map<String, List<String>> ALLOWED_TRANSITIONS = Map.of(
            "OPEN", List.of("IN_PROGRESS", "REJECTED"),
            "IN_PROGRESS", List.of("RESOLVED", "OPEN"),
            "RESOLVED", List.of("CLOSED", "IN_PROGRESS"),
            "CLOSED", List.of(),
            "REJECTED", List.of("OPEN")
    );

    public TicketResponseDTO create(TicketRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Ticket ticket = Ticket.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .category(dto.getCategory())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .status(TicketStatus.OPEN)
                .user(user)
                .preferredContact(dto.getPreferredContact())
                .resourceId(dto.getResourceId())
                .build();
        
        Ticket saved = ticketRepository.save(ticket);
        return mapToResponseDTO(saved);
    }

    public TicketResponseDTO update(Long id, TicketRequestDTO dto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new ValidationException("Cannot update a " + ticket.getStatus() + " ticket");
        }
        
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setLocation(dto.getLocation());
        ticket.setPreferredContact(dto.getPreferredContact());
        if (dto.getImageUrl() != null) {
            ticket.setImageUrl(dto.getImageUrl());
        }
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO updateStatus(Long id, TicketStatus newStatus) {
        return updateStatus(id, newStatus, null);
    }

    public TicketResponseDTO updateStatus(Long id, TicketStatus newStatus, String reason) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        validateStatusTransition(ticket.getStatus(), newStatus);
        
        TicketStatus oldStatus = ticket.getStatus();
        ticket.setStatus(newStatus);
        
        if (newStatus == TicketStatus.IN_PROGRESS) {
            ticket.setAssignedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        } else if (newStatus == TicketStatus.REJECTED) {
            ticket.setRejectionReason(reason);
        }
        
        Ticket updated = ticketRepository.save(ticket);
        
        // Send notification to user about ticket status change
        sendTicketStatusNotification(updated, oldStatus, newStatus, reason);
        
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO assignTicket(Long id, Long assignedToId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new ValidationException("Can only assign tickets with OPEN status");
        }
        
        User assignee = userRepository.findById(assignedToId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        
        ticket.setAssignedTo(assignee);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setAssignedAt(LocalDateTime.now());
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO resolve(Long id, String resolution, Long userId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new ValidationException("Can only resolve tickets that are IN_PROGRESS");
        }
        
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setResolutionNotes(resolution);
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO close(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new ValidationException("Can only close resolved tickets");
        }
        
        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setClosedAt(LocalDateTime.now());
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO reject(Long id, String reason) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new ValidationException("Can only reject OPEN tickets");
        }
        
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO reopen(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        if (ticket.getStatus() != TicketStatus.REJECTED && ticket.getStatus() != TicketStatus.CLOSED) {
            throw new ValidationException("Can only reopen rejected or closed tickets");
        }
        
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setRejectionReason(null);
        ticket.setResolvedAt(null);
        ticket.setClosedAt(null);
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    @Transactional(readOnly = true)
    public TicketResponseDTO getById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return mapToResponseDTO(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getAll() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getByUserId(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getByUserIdAndStatus(Long userId, TicketStatus status) {
        return ticketRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getByAssignedToId(Long technicianId) {
        return ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(technicianId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getAssignedTicketsForTechnician(Long technicianId) {
        return ticketRepository.findByAssignedToIdAndStatusIn(
                technicianId,
                List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
        ).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }

    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus) {
        List<String> allowed = ALLOWED_TRANSITIONS.get(currentStatus.name());
        if (allowed == null || !allowed.contains(newStatus.name())) {
            throw new ValidationException(
                    "Invalid status transition from " + currentStatus + " to " + newStatus +
                    ". Allowed transitions: " + allowed
            );
        }
    }

    private TicketResponseDTO mapToResponseDTO(Ticket ticket) {
        List<CommentDTO> comments = ticket.getComments().stream()
                .map(comment -> CommentDTO.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .ticketId(ticket.getId())
                        .userId(comment.getUser().getId())
                        .userName(comment.getUser().getFullName())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        
        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .category(ticket.getCategory())
                .location(ticket.getLocation())
                .imageUrl(ticket.getImageUrl())
                .preferredContact(ticket.getPreferredContact())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .resourceId(ticket.getResourceId())
                .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                .userName(ticket.getUser() != null ? ticket.getUser().getFullName() : null)
                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getFullName() : null)
                .comments(comments)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .closedAt(ticket.getClosedAt())
                .assignedAt(ticket.getAssignedAt())
                .build();
    }

    private void sendTicketStatusNotification(Ticket ticket, TicketStatus oldStatus, TicketStatus newStatus, String reason) {
        try {
            String title;
            String message;
            String notificationType = "TICKET_" + newStatus.name();

            switch (newStatus) {
                case IN_PROGRESS:
                    title = "Ticket Under Review";
                    message = String.format("Your ticket #%d (%s) is now being looked at.", 
                        ticket.getId(), ticket.getTitle());
                    break;
                case RESOLVED:
                    title = "Ticket Resolved";
                    message = String.format("Your ticket #%d (%s) has been resolved. %s", 
                        ticket.getId(), ticket.getTitle(),
                        ticket.getResolutionNotes() != null ? "Notes: " + ticket.getResolutionNotes() : "");
                    break;
                case CLOSED:
                    title = "Ticket Closed";
                    message = String.format("Your ticket #%d (%s) has been closed.", 
                        ticket.getId(), ticket.getTitle());
                    break;
                case REJECTED:
                    title = "Ticket Rejected";
                    message = String.format("Your ticket #%d (%s) has been rejected. Reason: %s", 
                        ticket.getId(), ticket.getTitle(), reason != null ? reason : "Not specified");
                    break;
                case OPEN:
                    if (oldStatus == TicketStatus.REJECTED || oldStatus == TicketStatus.CLOSED) {
                        title = "Ticket Reopened";
                        message = String.format("Your ticket #%d (%s) has been reopened.", 
                            ticket.getId(), ticket.getTitle());
                    } else {
                        return;
                    }
                    break;
                default:
                    return;
            }

            NotificationDTO notification = NotificationDTO.builder()
                    .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                    .title(title)
                    .message(message)
                    .notificationType(notificationType)
                    .referenceId(ticket.getId())
                    .build();

            notificationService.create(notification);
        } catch (Exception e) {
            System.err.println("Failed to send ticket notification: " + e.getMessage());
        }
    }
}