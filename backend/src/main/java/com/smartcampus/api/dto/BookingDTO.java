package com.smartcampus.api.dto;

import com.smartcampus.api.enums.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    private String resourceName;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    private String purpose;

    private BookingStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long approvedBy;
}