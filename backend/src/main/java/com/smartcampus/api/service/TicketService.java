package com.smartcampus.api.service;

import com.smartcampus.api.dto.TicketRequestDTO;
import com.smartcampus.api.dto.TicketResponseDTO;
import com.smartcampus.api.dto.CommentDTO;
import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

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
                .build();
        
        Ticket saved = ticketRepository.save(ticket);
        return mapToResponseDTO(saved);
    }

    public TicketResponseDTO update(Long id, TicketRequestDTO dto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setLocation(dto.getLocation());
        if (dto.getImageUrl() != null) {
            ticket.setImageUrl(dto.getImageUrl());
        }
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO updateStatus(Long id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setStatus(status);
        if (status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO assignTicket(Long id, Long assignedToId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User assignee = userRepository.findById(assignedToId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        ticket.setAssignedTo(assignee);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public TicketResponseDTO resolve(Long id, String resolution, Long userId) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        
        com.smartcampus.api.model.Comment comment = com.smartcampus.api.model.Comment.builder()
                .content("Resolution: " + resolution)
                .ticket(ticket)
                .user(user)
                .build();
        ticket.getComments().add(comment);
        
        Ticket updated = ticketRepository.save(ticket);
        return mapToResponseDTO(updated);
    }

    public void addCommentToTicket(Long ticketId, CommentDTO comment) {
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

    public void delete(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found");
        }
        ticketRepository.deleteById(id);
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
                .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                .userName(ticket.getUser() != null ? ticket.getUser().getFullName() : null)
                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getFullName() : null)
                .comments(comments)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .build();
    }
}