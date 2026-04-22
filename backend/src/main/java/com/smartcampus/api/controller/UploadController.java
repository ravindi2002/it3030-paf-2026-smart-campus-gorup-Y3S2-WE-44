package com.smartcampus.api.controller;

import com.smartcampus.api.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileUploadUtil fileUploadUtil;

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileUploadUtil.saveFile(file);
            String url = "http://localhost:8080/uploads/" + fileName;

            Map<String, Object> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("url", url);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<Map<String, String>>> uploadMultiple(@RequestParam("files") MultipartFile[] files) {
        List<Map<String, String>> responses = new ArrayList<>();
        int count = 0;
        
        for (MultipartFile file : files) {
            if (count >= 3) break;
            try {
                String fileName = fileUploadUtil.saveFile(file);
                String url = "http://localhost:8080/uploads/" + fileName;
                
                Map<String, String> response = new HashMap<>();
                response.put("fileName", fileName);
                response.put("url", url);
                responses.add(response);
                count++;
            } catch (IOException e) {
                // Skip failed uploads
            }
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) {
        fileUploadUtil.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }
}