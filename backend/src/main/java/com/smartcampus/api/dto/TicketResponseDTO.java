package com.smartcampus.api.dto;

import com.smartcampus.api.enums.Priority;
import com.smartcampus.api.enums.TicketStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponseDTO {

    private Long id;

    private String title;

    private String description;

    private TicketStatus status;

    private Priority priority;

    private String category;

    private String location;

    private String imageUrl;

    private Long userId;

    private String userName;

    private Long assignedToId;

    private String assignedToName;

    private List<CommentDTO> comments;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;
}