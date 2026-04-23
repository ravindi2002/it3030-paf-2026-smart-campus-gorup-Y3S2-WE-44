package com.smartcampus.api.security;

import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.enums.RoleType;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication) throws IOException, ServletException {
        String email = authentication.getName();

        @SuppressWarnings("null")
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            // Make ireshawarani@gmail.com an admin, others get USER role
            RoleType userRole = "ireshawarani@gmail.com".equals(email) ? RoleType.ADMIN : RoleType.USER;
            
            User newUser = User.builder()
                    .username(email.split("@")[0])
                    .email(email)
                    .password("")
                    .role(userRole)
                    .build();
            return userRepository.save(newUser);
        });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = userDetailsService.generateToken(userDetails);

        Map<String, Object> userData = new HashMap<>();
        userData.put("username", userDetails.getUsername());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole().toString());
        
        String userJson = String.format(
            "{\"username\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}",
            userData.get("username"),
            userData.get("email"),
            userData.get("role")
        );
        
        String redirectUrl = String.format(
            "http://localhost:5173/oauth/callback?token=%s&user=%s",
            token,
            URLEncoder.encode(userJson, StandardCharsets.UTF_8)
        );
        
        response.sendRedirect(redirectUrl);
    }
}