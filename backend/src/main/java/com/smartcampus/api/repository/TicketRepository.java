package com.smartcampus.api.repository;

import com.smartcampus.api.enums.TicketStatus;
import com.smartcampus.api.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByAssignedToId(Long userId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(Ticket ticket);
    List<Ticket> findByCategory(String category);
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);
    List<Ticket> findByAssignedToIdAndStatusIn(Long assignedToId, List<TicketStatus> statuses);
    List<Ticket> findByAssignedToIdAndStatus(Long assignedToId, TicketStatus status);
    long countByAssignedToIdAndStatus(Long assignedToId, TicketStatus status);
    List<Ticket> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, TicketStatus status);
}