package com.smartcampus.api.controller;

import com.smartcampus.api.security.CustomUserDetailsService;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * ========================================================================
 * MODULE E: AUTHENTICATION & AUTHORIZATION CONTROLLER
 * ========================================================================
 * This controller handles all authentication operations.
 * 
 * VIVA KEY POINTS:
 * 
 * 1. JWT (JSON WEB TOKEN) AUTHENTICATION:
 *    - After login, server generates a signed JWT token
 *    - Token contains user info and expiration time
 *    - Client sends token in Authorization header for subsequent requests
 *    - Format: Authorization: Bearer <token>
 * 
 * 2. OAUTH 2.0 (GOOGLE SIGN-IN):
 *    - Users can sign in with their Google account
 *    - No need to store passwords in our database
 *    - Google provides user profile info
 *    - Configured in application.properties with clientId/clientSecret
 * 
 * 3. ROLES IN SYSTEM:
 *    - USER: Regular user (students/staff)
 *    - ADMIN: Can approve/reject bookings, manage resources
 *    - TECHNICIAN: Can resolve tickets, assigned to tickets
 * ========================================================================
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    /**
     * LOGIN (POST) - Returns JWT Token
     * Access: All users
     * 
     * VIVA NOTE: This is how login works:
     * 1. User sends username/password
     * 2. Spring Security validates credentials
     * 3. If valid, generate JWT token
     * 4. Return token + user info to client
     * 
     * Request:
     * {
     *   "username": "john",
     *   "password": "password123"
     * }
     * 
     * Response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIs...",
     *   "username": "john",
     *   "userId": 1,
     *   "role": "USER"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Authenticate with Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        
        // Generate JWT token with CustomUserDetailsService
        String token = userDetailsService.generateToken(userDetails);

        // Get user ID from database
        Optional<User> userOpt = userRepository.findByUsername(username);
        Long userId = userOpt.map(User::getId).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", userDetails.getUsername());
        response.put("userId", userId);
        response.put("role", userOpt.map(u -> u.getRole().name()).orElse("USER"));

        return ResponseEntity.ok(response);
    }

    /**
     * REGISTER (POST) - Redirects to User Controller
     * NOTE: Registration handled by UserController
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Use /api/users/register for registration");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * LOGOUT (POST)
     * Access: Authenticated users
     * 
     * NOTE: For JWT, logout is handled client-side by removing token
     * This endpoint exists for completeness and future token blacklisting
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    /**
     * GET CURRENT USER (GET)
     * Access: Authenticated users
     * 
     * VIVA NOTE: Used to check auth status and get user info
     * Client calls this after login to verify token is valid
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        userOpt.ifPresent(user -> {
            response.put("userId", user.getId());
            response.put("role", user.getRole().name());
        });
        
        return ResponseEntity.ok(response);
    }

    /**
     * OAUTH2 SUCCESS (GET)
     * Access: Public
     * 
     * VIVA NOTE: This is the callback URL after Google login
     * When user signs in with Google, they're redirected here
     * OAuthSuccessHandler handles the actual token generation
     */
    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OAuth2 login successful");
        response.put("user", oauth2User.getAttributes());
        
        return ResponseEntity.ok(response);
    }

    /**
     * OAUTH2 FAILURE (GET)
     * Access: Public
     * Called when Google OAuth fails
     */
    @GetMapping("/oauth2/failure")
    public ResponseEntity<Map<String, Object>> oauth2Failure() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OAuth2 login failed");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}