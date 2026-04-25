package com.smartcampus.api.repository;

import com.smartcampus.api.enums.BookingStatus;
import com.smartcampus.api.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByResourceId(Long resourceId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByResourceIdAndStatus(Long resourceId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED' " +
           "AND b.startTime < :end AND b.endTime > :start")
    List<Booking> findConflictingBookings(@Param("resourceId") Long resourceId,
                                         @Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);
    
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.resource.id = :resourceId AND b.status = 'APPROVED' " +
           "AND b.startTime <= :currentTime AND b.endTime >= :currentTime")
    boolean existsActiveBooking(@Param("resourceId") Long resourceId, 
                               @Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.status = 'APPROVED' " +
           "AND b.startTime <= :currentTime AND b.endTime >= :currentTime")
    List<Booking> findActiveBookingsForResource(@Param("resourceId") Long resourceId,
                                               @Param("currentTime") LocalDateTime currentTime);
}