package com.smartcampus.api.service;

import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.TicketImage;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.TicketImageRepository;
import com.smartcampus.api.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketImageService {

    private final TicketImageRepository ticketImageRepository;
    private final TicketRepository ticketRepository;

    private static final String UPLOAD_DIR = "uploads/tickets/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final int MAX_IMAGES = 3;

    public List<TicketImage> getImagesByTicketId(Long ticketId) {
        return ticketImageRepository.findByTicketId(ticketId);
    }

    public TicketImage uploadImage(Long ticketId, MultipartFile file) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        int currentImages = ticketImageRepository.findByTicketId(ticketId).size();
        if (currentImages >= MAX_IMAGES) {
            throw new RuntimeException("Maximum " + MAX_IMAGES + " images allowed per ticket");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size cannot exceed " + MAX_FILE_SIZE / (1024 * 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }

        TicketImage ticketImage = TicketImage.builder()
                .imageUrl("/" + UPLOAD_DIR + fileName)
                .fileName(originalFilename)
                .fileType(contentType)
                .fileSize(file.getSize())
                .ticket(ticket)
                .build();

        return ticketImageRepository.save(ticketImage);
    }

    public void deleteImage(Long imageId) {
        TicketImage image = ticketImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        try {
            Path filePath = Paths.get(image.getImageUrl().replaceFirst("^/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        ticketImageRepository.delete(image);
    }

    public void deleteAllByTicketId(Long ticketId) {
        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);
        for (TicketImage image : images) {
            try {
                Path filePath = Paths.get(image.getImageUrl().replaceFirst("^/", ""));
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete file: " + e.getMessage());
            }
        }
        ticketImageRepository.deleteByTicketId(ticketId);
    }
}