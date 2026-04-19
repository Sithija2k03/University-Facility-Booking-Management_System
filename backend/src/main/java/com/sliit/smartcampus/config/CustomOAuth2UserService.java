package com.sliit.smartcampus.config;

import com.sliit.smartcampus.common.enums.RoleType;
import com.sliit.smartcampus.user.entity.User;
import com.sliit.smartcampus.user.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oauthUser = delegate.loadUser(userRequest);

        String email = oauthUser.getAttribute("email");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account email not found");
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        RoleType role = existingUserOpt
                .map(User::getRole)
                .orElse(RoleType.USER);

        Set<GrantedAuthority> mappedAuthorities = new HashSet<>(oauthUser.getAuthorities());
        mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));

        return new DefaultOAuth2User(
                mappedAuthorities,
                oauthUser.getAttributes(),
                "email"
        );
    }
}