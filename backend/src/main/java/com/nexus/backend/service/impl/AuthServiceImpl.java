package com.nexus.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nexus.backend.config.JwtProperties;
import com.nexus.backend.dto.request.LoginRequest;
import com.nexus.backend.dto.request.RegisterRequest;
import com.nexus.backend.dto.response.AuthResponse;
import com.nexus.backend.entity.Plan;
import com.nexus.backend.entity.User;
import com.nexus.backend.entity.OtpVerification;
import com.nexus.backend.exception.DuplicateResourceException;
import com.nexus.backend.exception.InvalidCredentialsException;
import com.nexus.backend.exception.ResourceNotFoundException;
import com.nexus.backend.repository.UserRepository;
import com.nexus.backend.repository.OtpVerificationRepository;
import com.nexus.backend.security.JwtUtil;
import com.nexus.backend.service.AuthService;
import com.nexus.backend.service.EmailService;

import lombok.RequiredArgsConstructor;

/**
 * AuthServiceImpl
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final JwtProperties jwtProperties;
    private final EmailService emailService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered.");
        }

        // Verify OTP
        OtpVerification verification = otpVerificationRepository.findById(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("No verification code requested for this email."));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Verification code has expired. Please request a new one.");
        }

        if (!verification.getOtp().equals(request.otp())) {
            throw new InvalidCredentialsException("Invalid verification code.");
        }

        // Delete verification code on success
        otpVerificationRepository.delete(verification);

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .username(request.username())
                .plan(Plan.FREE)
                .credits(3)
                .lastReset(LocalDate.now())
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                user.getEmail(),
                token,
                (int) (jwtProperties.expiration() / 1000));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(), request.password()));
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow();

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                user.getEmail(),
                token,
                (int) (jwtProperties.expiration() / 1000));
    }

    @Override
    public void sendOtp(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered.");
        }

        // Generate 6-digit OTP code
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // Save or overwrite verification entry
        OtpVerification verification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();
        otpVerificationRepository.save(verification);

        // Dispatch async email via Brevo
        emailService.sendOtpEmail(email, otp);
    }
}
