package com.smartcampus.api.config;

import com.smartcampus.api.security.CustomUserDetailsService;
import com.smartcampus.api.security.JwtFilter;
import com.smartcampus.api.security.OAuthSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * ========================================================================
 * SECURITY CONFIGURATION
 * ========================================================================
 * This is the main Spring Security configuration file.
 * 
 * VIVA KEY POINTS EXPLAINED:
 * 
 * 1. JWT (JSON WEB TOKEN) FLOW:
 *    ┌──────────┐         ┌──────────────┐         ┌──────────┐
 *    │  User    │──── login ──→│   Server   │←── token ──│  Client  │
 *    │(Browser) │         │(Generate) │         │(Stores)  │
 *    └──────────┘         └──────────────┘         └──────────┘
 *           │                                     │
 *           │        Every request with:          │
 *           └─────── Bearer <token> ───────────────┘
 *                        │
 *                        ↓
 *              ┌────────┴────────┐
 *              │  JwtFilter   │
 *              │  validates │
 *              │  token     │
 *              └────────────┘
 * 
 * 2. OAUTH 2.0 (GOOGLE SIGN-IN):
 *    ┌──────────┐         ┌──────────────┐
 *    │  User    │─Click ──→│   Google   │
 *    │         │  "Login  │   Login    │
 *    │(Select) │   with   │   Page     │
 *    │  Google │   Google │           │
 *    └──────────┘         └─────┬──────┘
 *                             │
 *                             ↓ (redirect back with code)
 *                      ┌──────────────┐
 *                      │   OAuth     │
 *                      │  Handler   │
 *                      │ creates    │
 *                      │ account   │
 *                      └──────────┘
 * 
 * 3. PASSWORD ENCODING (BCRYPT):
 *    - Passwords are NOT stored as plain text
 *    - BCrypt hashes passwords with salt
 *    - Even same password = different hash each time
 *    - Check: $2a$10$...
 * 
 * 4. ROLE-BASED ACCESS (RBAC):
 *    - @PreAuthorize("hasRole('ADMIN')") - Only ADMIN
 *    - @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')") - ADMIN or TECHNICIAN
 *    - Applied at controller level
 * ========================================================================
 */
@Configuration
@EnableWebSecurity  // Enables Spring Security web support
@EnableMethodSecurity  // Enables @PreAuthorize annotations
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    private final OAuthSuccessHandler oauthSuccessHandler;

    /**
     * PASSWORD ENCODER BEAN
     * VIVA NOTE: Uses BCrypt algorithm
     * - One-way hashing (cannot reverse)
     * - Auto-generates salt
     * - Multiple rounds for security
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AUTHENTICATION MANAGER
     * Spring Security's authentication manager
     * Used to authenticate user credentials
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * AUTHENTICATION PROVIDER
     * VIVA NOTE: This connects:
     * - UserDetailsService (loads user from DB)
     * - PasswordEncoder (verifies password)
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * MAIN SECURITY FILTER CHAIN
     * VIVA NOTE: This is where all security is configured!
     * 
     * PERMITTED ENDPOINTS (no login required):
     * - /api/auth/** - Login, register, OAuth
     * - /api/users/register - New user signup
     * - /api/uploads/** - File uploads
     * - /h2-console/** - H2 database console (dev only!)
     * - /oauth2/** - OAuth endpoints
     * 
     * PROTECTED ENDPOINTS (login required):
     * - /api/admin/** - Admin endpoints
     * - /api/tickets/** - Ticket management
     * - All other /api/** endpoints
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for REST API with JWT)
                .csrf(AbstractHttpConfigurer::disable)
                
                // Configure CORS (Cross-Origin Resource Sharing)
                .cors(cors -> {})
                
                // AUTHORIZATION RULES
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no auth needed)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .requestMatchers("/api/uploads/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        
                        // 🔥 Tickets GET public (no auth needed) - for QR display
                        .requestMatchers("/api/tickets").permitAll()
                        .requestMatchers("/api/tickets/*").permitAll()
                        .requestMatchers("/api/tickets/*/qr").permitAll()
                        .requestMatchers("/api/tickets/*/images").permitAll()
                        .requestMatchers("/api/tickets/*/comments").permitAll()
                        .requestMatchers("/api/tickets/public/*").permitAll()
                        .requestMatchers("/api/tickets/create-test").permitAll()
                        .requestMatchers("/api/tickets/with-images").permitAll()
                        .requestMatchers("/api/tickets/resources/*/qr").permitAll()
                        
                        // 🔥 Resources - public for viewing (GET only)
                        .requestMatchers(HttpMethod.GET, "/api/admin/resources").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/admin/resources/*").permitAll()
                        .requestMatchers("/api/resources").permitAll()
                        .requestMatchers("/api/resources/*").permitAll()
                        
                        // 🔥 Bookings - public for viewing (GET only)
                        .requestMatchers(HttpMethod.GET, "/api/admin/bookings").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/admin/bookings/*").permitAll()
                        
                        // Protected endpoints
                        .requestMatchers("/api/admin/**").authenticated()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated()
                )
                
                // OAUTH 2.0 CONFIGURATION (Google Sign-In)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauthSuccessHandler)
                        .failureUrl("/api/auth/oauth2/failure")
                )
                
                // SESSION MANAGEMENT
                // VIVA NOTE: IF_REQUIRED = create session only when needed
                // JWT doesn't need sessions!
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                
                // ADD JWT FILTER BEFORE USERNAME/PASSWORD FILTER
                // VIVA NOTE: Intercepts every request to validate JWT
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider())
                
                // Allow H2 console in iframe
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                );

        return http.build();
    }
}