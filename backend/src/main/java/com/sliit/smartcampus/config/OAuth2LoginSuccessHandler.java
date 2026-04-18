package com.sliit.smartcampus.config;

import com.sliit.smartcampus.common.enums.AuthProvider;
import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
    ) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        String googleId = oauthUser.getAttribute("sub");

        if (email == null || email.isBlank()) {
            response.sendRedirect("http://localhost:5173/login?error=google_email_missing");
            return;
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();

            user.setProvider(AuthProvider.valueOf("GOOGLE"));
            user.setProviderId(googleId);
            user.setProfilePicture(picture);

            if (user.getName() == null || user.getName().isBlank()) {
                user.setName(name);
            }
        } else {
            user = User.builder()
                    .name(name != null ? name : email)
                    .email(email)
                    .role(RoleType.USER)
                    .provider(AuthProvider.valueOf("GOOGLE"))
                    .providerId(googleId)
                    .profilePicture(picture)
                    .build();
        }

        userRepository.save(user);

        response.sendRedirect("http://localhost:5173/oauth2/success");
    }
}