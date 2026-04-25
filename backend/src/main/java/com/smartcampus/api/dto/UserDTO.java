package com.smartcampus.api.dto;

import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.enums.StaffAvailability;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
 
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String password;

    private String fullName;

    private String studentId;

    private String department;

    private RoleType role;

    private StaffAvailability availability;

    private String profileImage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean enabled;
}