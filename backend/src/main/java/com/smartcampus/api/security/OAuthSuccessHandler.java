package com.smartcampus.api.security;

import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {},
                () -> {
                    User newUser = User.builder()
                            .username(email.split("@")[0])
                            .email(email)
                            .fullName(oauth2User.getAttribute("name"))
                            .password("")
                            .build();
                    userRepository.save(newUser);
                }
        );

        response.sendRedirect("/");
    }
}