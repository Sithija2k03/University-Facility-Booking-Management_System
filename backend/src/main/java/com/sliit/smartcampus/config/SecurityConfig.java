package com.sliit.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOidcUserService customOidcUserService;

    public SecurityConfig(
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
            CustomOidcUserService customOidcUserService
    ) {
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/error",
                                "/favicon.ico",
                                "/uploads/**",
                                "/api/test",
                                "/api/auth/register",
                                "/api/auth/login",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()

                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/auth/oauth2/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/me").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/resources/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasRole("ADMIN")

                        // bookings
                        .requestMatchers(HttpMethod.GET, "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/cancel").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/bookings/*/reject").hasRole("ADMIN")

                        // tickets
                        .requestMatchers(HttpMethod.GET, "/api/tickets/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tickets/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/assign").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/tickets/*/status").hasAnyRole("ADMIN", "TECHNICIAN")

                        .requestMatchers("/api/tickets/*/comments/**").authenticated()
                        .requestMatchers("/api/tickets/*/attachments/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/users/role/**").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                        )
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(auth -> auth
                                .baseUri("/oauth2/authorize")
                        )
                        .redirectionEndpoint(redirect -> redirect
                                .baseUri("/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(customOidcUserService)
                        )
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .formLogin(form -> form.disable());

        return http.build();
    }
}