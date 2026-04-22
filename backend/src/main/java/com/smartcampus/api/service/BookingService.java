package com.smartcampus.api.service;

import com.smartcampus.api.dto.BookingDTO;
import com.smartcampus.api.enums.BookingStatus;
import com.smartcampus.api.exception.ResourceNotFoundException;
import com.smartcampus.api.exception.ValidationException;
import com.smartcampus.api.model.Booking;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public BookingDTO create(BookingDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        
        validateBookingTimes(dto);
        
        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .status(BookingStatus.PENDING)
                .build();
        
        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    public BookingDTO update(Long id, BookingDTO dto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        
        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    public BookingDTO updateStatus(Long id, BookingStatus status, Long approvedById) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        booking.setStatus(status);
        if (approvedById != null) {
            booking.setApprovedBy(approvedById);
        }
        
        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public BookingDTO getById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToDTO(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getAll() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByResourceId(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    private void validateBookingTimes(BookingDTO dto) {
        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new ValidationException("End time must be after start time");
        }
        if (dto.getStartTime().isBefore(java.time.LocalDateTime.now())) {
            throw new ValidationException("Start time must be in the future");
        }
    }

    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userName(booking.getUser() != null ? booking.getUser().getFullName() : null)
                .resourceId(booking.getResource() != null ? booking.getResource().getId() : null)
                .resourceName(booking.getResource() != null ? booking.getResource().getName() : null)
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .approvedBy(booking.getApprovedBy())
                .build();
    }
}