package com.sliit.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // public
                        .requestMatchers("/api/test", "/api/auth/register", "/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/me").authenticated()

                        // resources
                        .requestMatchers("/api/resources/search", "/api/resources", "/api/resources/*").authenticated()
                        .requestMatchers("/api/resources/**").hasRole("ADMIN")

                        // bookings
                        .requestMatchers("/api/bookings/*/approve", "/api/bookings/*/reject").hasRole("ADMIN")
                        .requestMatchers("/api/bookings/**").authenticated()

                        // tickets
                        .requestMatchers("/api/tickets/*/assign").hasRole("ADMIN")
                        .requestMatchers("/api/tickets/*/status").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/tickets/**").authenticated()

                        // comments, attachments, notifications
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/tickets/*/comments/**").authenticated()
                        .requestMatchers("/api/tickets/*/attachments/**").authenticated()

                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .oauth2Login(oauth2 -> oauth2.disable());

        return http.build();
    }
}