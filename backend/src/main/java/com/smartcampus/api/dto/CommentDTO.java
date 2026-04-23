package com.smartcampus.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {

    private Long id;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    private Long userId;

    private String userName;

    private LocalDateTime createdAt;
}