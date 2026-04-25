package com.smartcampus.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ticket_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "uploaded_at")
    private java.time.LocalDateTime uploadedAt;

    @PrePersist
    protected void onUpload() {
        uploadedAt = java.time.LocalDateTime.now();
    }
}