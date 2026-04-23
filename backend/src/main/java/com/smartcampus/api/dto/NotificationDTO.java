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
public class NotificationDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private Boolean isRead;

    private String notificationType;

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long referenceId;

    private LocalDateTime createdAt;
}