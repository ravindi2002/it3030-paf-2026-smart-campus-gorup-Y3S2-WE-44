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

import java.time.LocalDateTime;
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
        validateCapacity(dto, resource);
        validateNoConflict(dto.getResourceId(), dto.getStartTime(), dto.getEndTime());

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
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
        booking.setExpectedAttendees(dto.getExpectedAttendees());

        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
    }

    public BookingDTO updateStatus(Long id, BookingStatus status, Long approvedById, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        validateStatusTransition(booking.getStatus(), status);

        booking.setStatus(status);
        if (approvedById != null) {
            booking.setApprovedBy(approvedById);
        }
        if (status == BookingStatus.REJECTED && rejectionReason != null) {
            booking.setRejectionReason(rejectionReason);
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

    @Transactional(readOnly = true)
    public List<BookingDTO> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getStartTime().isAfter(startDate) && booking.getEndTime().isBefore(endDate))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByResourceAndDateRange(Long resourceId, LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findByResourceId(resourceId).stream()
                .filter(booking -> booking.getStartTime().isAfter(startDate) && booking.getEndTime().isBefore(endDate))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO cancelBooking(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new ValidationException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new ValidationException("Only approved or pending bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return mapToDTO(updated);
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
        if (dto.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ValidationException("Start time must be in the future");
        }
        if (dto.getExpectedAttendees() != null && dto.getExpectedAttendees() <= 0) {
            throw new ValidationException("Expected attendees must be greater than 0");
        }
    }

    private void validateCapacity(BookingDTO dto, Resource resource) {
        if (dto.getExpectedAttendees() != null && resource.getCapacity() != null) {
            if (dto.getExpectedAttendees() > resource.getCapacity()) {
                throw new ValidationException("Expected attendees exceeds resource capacity of " + resource.getCapacity());
            }
        }
    }

    private void validateNoConflict(Long resourceId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(resourceId, startTime, endTime);
        if (!conflictingBookings.isEmpty()) {
            throw new ValidationException("Resource is already booked for the selected time period");
        }
    }

    private void validateStatusTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        if (currentStatus == BookingStatus.CANCELLED) {
            throw new ValidationException("Cannot change status of a cancelled booking");
        }
        if (currentStatus == BookingStatus.REJECTED && newStatus != BookingStatus.PENDING) {
            throw new ValidationException("Rejected bookings can only be set back to pending");
        }
        if (currentStatus == BookingStatus.APPROVED && newStatus == BookingStatus.PENDING) {
            throw new ValidationException("Approved bookings cannot be set back to pending");
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
                .expectedAttendees(booking.getExpectedAttendees())
                .rejectionReason(booking.getRejectionReason())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .approvedBy(booking.getApprovedBy())
                .build();
    }
}