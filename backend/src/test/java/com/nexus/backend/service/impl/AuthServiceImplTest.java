package com.nexus.backend.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.nexus.backend.config.JwtProperties;
import com.nexus.backend.exception.*;
import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.response.AuthResponse;
import com.nexus.backend.entity.Role;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.security.JwtUtil;
import com.nexus.backend.entity.User;

import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * AuthServiceImplTest
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("test@example.com", "password123", "name");
        loginRequest = new LoginRequest("test@example.com", "password123");
    }

    @Test
    void register_success_returnsAuthResponse() {
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("hashed-password");
        when(jwtUtil.generateToken(registerRequest.email())).thenReturn("fake-jwt-token");
        when(jwtProperties.expiration()).thenReturn(86400000L);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.token()).isEqualTo("fake-jwt-token");
        assertThat(response.expiresIn()).isEqualTo(86400);

        verify(userRepository).save(argThat(user -> user.getEmail().equals("test@example.com") &&
                user.getPassword().equals("hashed-password")));
    }

    @Test
    void register_duplicateEmail_throwsAndNeverSaves() {
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void login_success_returnsAuthResponse() {
        User user = User.builder()
                .email("test@example.com")
                .password("hashed-password")
                .build();

        when(userRepository.findByEmail(loginRequest.email())).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(loginRequest.email())).thenReturn("fake-jwt-token");
        when(jwtProperties.expiration()).thenReturn(86400000L);
        // authenticationManager.authenticate(...) succeeds silently (void-ish, no
        // exception)

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.token()).isEqualTo("fake-jwt-token");

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
    }

    @Test
    void login_badCredentials_throwsInvalidCredentialsException() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");

        verifyNoInteractions(jwtUtil);
    }

}
