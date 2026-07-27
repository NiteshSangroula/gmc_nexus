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
import com.nexus.backend.entity.User;
import com.nexus.backend.entity.OtpVerification;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.repository.OtpVerificationRepository;
import com.nexus.backend.security.JwtUtil;
import com.nexus.backend.service.EmailService;

import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
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
    private OtpVerificationRepository otpVerificationRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtProperties jwtProperties;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("test@example.com", "password123", "name", "123456");
        loginRequest = new LoginRequest("test@example.com", "password123");
    }

    @Test
    void register_success_returnsAuthResponse() {
        OtpVerification otpVerification = new OtpVerification("test@example.com", "123456", LocalDateTime.now().plusMinutes(10));
        when(otpVerificationRepository.findById(registerRequest.email())).thenReturn(Optional.of(otpVerification));

        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("hashed-password");
        when(jwtUtil.generateToken(registerRequest.email())).thenReturn("fake-jwt-token");
        when(jwtProperties.expiration()).thenReturn(86400000L);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.token()).isEqualTo("fake-jwt-token");
        assertThat(response.expiresIn()).isEqualTo(86400);

        verify(otpVerificationRepository).delete(otpVerification);
        verify(userRepository).save(argThat(user -> user.getEmail().equals("test@example.com") &&
                user.getPassword().equals("hashed-password")));
    }

    @Test
    void register_invalidOtp_throwsInvalidCredentialsException() {
        OtpVerification otpVerification = new OtpVerification("test@example.com", "wrong-otp", LocalDateTime.now().plusMinutes(10));
        when(otpVerificationRepository.findById(registerRequest.email())).thenReturn(Optional.of(otpVerification));
        when(userRepository.existsByEmail(registerRequest.email())).thenReturn(false);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid verification code");

        verify(userRepository, never()).save(any());
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

    @Test
    void sendOtp_success_savesAndEmails() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);

        authService.sendOtp("test@example.com");

        verify(otpVerificationRepository).save(any(OtpVerification.class));
        verify(emailService).sendOtpEmail(eq("test@example.com"), anyString());
    }
}
