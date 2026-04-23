package com.smartcampus.api.dto;

import com.smartcampus.api.enums.ResourceStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceDTO {

    private Long id;

    @NotBlank(message = "Resource name is required")
    private String name;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private String resourceType;

    private ResourceStatus status;

    private String imageUrl;

    private Integer capacity;

    private Long createdById;

    private String createdByName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}