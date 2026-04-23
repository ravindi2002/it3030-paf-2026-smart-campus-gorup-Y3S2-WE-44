package com.smartcampus.api.service;

import com.smartcampus.api.dto.UserDTO;
import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.exception.ValidationException;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO create(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ValidationException("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ValidationException("Email already exists");
        }
        
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .studentId(dto.getStudentId())
                .department(dto.getDepartment())
                .role(dto.getRole() != null ? dto.getRole() : RoleType.USER)
                .profileImage(dto.getProfileImage())
                .enabled(true)
                .build();
        
        User saved = userRepository.save(user);
        return mapToDTO(saved);
    }

    public UserDTO update(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        if (dto.getStudentId() != null) {
            user.setStudentId(dto.getStudentId());
        }
        if (dto.getDepartment() != null) {
            user.setDepartment(dto.getDepartment());
        }
        if (dto.getProfileImage() != null) {
            user.setProfileImage(dto.getProfileImage());
        }
        
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    public UserDTO updateRole(Long id, RoleType role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    public UserDTO updatePassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public UserDTO getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAll() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getByRole(RoleType role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .studentId(user.getStudentId())
                .department(user.getDepartment())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .enabled(user.getEnabled())
                .build();
    }
}