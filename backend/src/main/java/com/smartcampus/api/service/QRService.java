package com.smartcampus.api.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * ========================================================================
 * QR CODE SERVICE - Smart Campus Innovation Feature
 * ========================================================================
 * This service generates QR codes for tickets.
 * 
 * VIVA KEY POINTS:
 * 
 * WHAT IT DOES:
 * 1. Generates unique QR code for each ticket
 * 2. QR contains URL to ticket details page
 * 3. Can be scanned to quickly access ticket
 * 
 * USE CASES:
 * - Print & stick on equipment
 * - Quick technician access
 * - Track assets
 * - Real-world maintenance systems
 * 
 * HOW IT WORKS:
 * 1. User creates ticket
 * 2. System generates QR with ticket URL
 * 3. QR can be downloaded/printed
 * 4. Anyone scans → opens ticket details
 * ========================================================================
 */
@Service
public class QRService {

    // QR code size (pixels)
    private static final int QR_SIZE = 250;
    
    // Frontend URL for tickets
    private static final String TICKET_BASE_URL = "http://localhost:5173/tickets/";

    /**
     * Generate QR Code for a ticket
     * 
     * @param ticketId - The ticket ID to generate QR for
     * @return byte array (PNG image)
     * 
     * VIVA NOTE: This creates a QR code that points to the ticket page
     * URL format: http://localhost:5173/tickets/{ticketId}
     */
    public byte[] generateQRForTicket(Long ticketId) throws WriterException, IOException {
        String ticketUrl = TICKET_BASE_URL + ticketId;
        return generateQRImage(ticketUrl);
    }

    /**
     * Generate QR Code for direct ticket creation with resource pre-filled
     * 
     * @param resourceId - The resource ID to pre-fill
     * @return byte array (PNG image)
     * 
     * VIVA INNOVATION: "Scan to Report Issue"
     * - Scan QR on equipment
     * - Opens create ticket page
     * - Resource auto-selected
     * - Zero manual input needed!
     */
    public byte[] generateQRForResource(Long resourceId) throws WriterException, IOException {
        String createUrl = TICKET_BASE_URL + "create?resourceId=" + resourceId;
        return generateQRImage(createUrl);
    }

    /**
     * Generate QR code with custom URL
     * 
     * @param content - Any URL or text content
     * @return byte array (PNG image)
     */
    public byte[] generateQRImage(String content) throws WriterException, IOException {
        // Create QR code writer
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        // Set encoding hints for better scanning
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);  // White margin around QR
        
        // Generate QR code matrix
        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE, hints);
        
        // Convert to PNG byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        return outputStream.toByteArray();
    }

    /**
     * Generate QR with security token (prevent unauthorized access)
     * 
     * @param ticketId - Ticket ID
     * @param token - Security token
     * @return byte array (PNG image)
     * 
     * VIVA NOTE: Pro-level security
     * - URL includes secure token
     * - Backend validates before showing ticket
     */
    public byte[] generateSecureQR(Long ticketId, String token) throws WriterException, IOException {
        String secureUrl = TICKET_BASE_URL + ticketId + "?token=" + token;
        return generateQRImage(secureUrl);
    }
}