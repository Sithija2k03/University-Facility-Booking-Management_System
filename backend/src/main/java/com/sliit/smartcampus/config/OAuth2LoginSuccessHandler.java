package com.sliit.smartcampus.config;

import com.sliit.smartcampus.common.enums.AuthProvider;
import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String picture = oidcUser.getPicture();
        String googleId = oidcUser.getSubject();

        if (email == null || email.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            user.setProvider(AuthProvider.GOOGLE);
            user.setProviderId(googleId);
            user.setProfilePicture(picture);
            user.setEmailVerified(true);
            if (user.getName() == null || user.getName().isBlank()) {
                user.setName(name);
            }
        } else {
            user = User.builder()
                    .name(name != null ? name : email)
                    .email(email)
                    .role(RoleType.USER)
                    .provider(AuthProvider.GOOGLE)
                    .providerId(googleId)
                    .profilePicture(picture)
                    .emailVerified(true)
                    .accountEnabled(true)
                    .build();
        }

        userRepository.save(user);

        String json = String.format(
                "{\"id\":%d,\"name\":\"%s\",\"email\":\"%s\",\"role\":\"%s\",\"profilePicture\":\"%s\",\"authMode\":\"oauth2\"}",
                user.getId(),
                user.getName() != null ? user.getName().replace("\"", "\\\"") : "",
                user.getEmail(),
                user.getRole().name(),
                user.getProfilePicture() != null ? user.getProfilePicture() : ""
        );

        userRepository.save(user);
        response.sendRedirect("http://localhost:5173/oauth2/success");
        
        PrintWriter writer = response.getWriter();
        writer.write(json);
        writer.flush();
    }
}