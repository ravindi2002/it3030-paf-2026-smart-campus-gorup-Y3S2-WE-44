package com.smartcampus.api.security;

import com.smartcampus.api.enums.RoleType;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                               HttpServletResponse response,
                               Authentication authentication) throws IOException, ServletException {
        
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String emailAttr = (String) oauthUser.getAttribute("email");
        String nameAttr = (String) oauthUser.getAttribute("name");
        String pictureAttr = (String) oauthUser.getAttribute("picture");

        final String email = emailAttr != null ? emailAttr : (String) oauthUser.getAttribute("sub");
        final String name = nameAttr;
        final String picture = pictureAttr;

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .username(email.split("@")[0])
                    .email(email)
                    .password("")
                    .fullName(name)
                    .role(RoleType.USER)
                    .profileImage(picture)
                    .enabled(true)
                    .build();
            return userRepository.save(newUser);
        });

        if (user.getRole() == RoleType.USER && isAdminEmail(email)) {
            user.setRole(RoleType.ADMIN);
            userRepository.save(user);
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = userDetailsService.generateToken(userDetails);

        String userJson = String.format("{\"id\":%d,\"username\":\"%s\",\"email\":\"%s\",\"fullName\":\"%s\",\"role\":\"%s\"}",
            user.getId(),
            escapeJson(user.getUsername()),
            escapeJson(user.getEmail()),
            escapeJson(user.getFullName()),
            user.getRole() != null ? user.getRole().name() : "USER"
        );

        String redirectUrl = "http://localhost:5173/oauth-callback?token=" + token + 
                        "&user=" + URLEncoder.encode(userJson, StandardCharsets.UTF_8);
        
        response.sendRedirect(redirectUrl);
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private boolean isAdminEmail(String email) {
        String adminEmails = "ravindisasanika12@gmail.com,hansanipoornima0809@gmail.com,ireshawarani@gmail.com";
        return adminEmails.contains(email.toLowerCase());
    }
}