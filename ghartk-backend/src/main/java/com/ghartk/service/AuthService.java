package com.ghartk.service;


import com.ghartk.dto.request.LoginRequest;
import com.ghartk.dto.request.RegisterRequest;
import com.ghartk.dto.response.AuthResponse;
import com.ghartk.entity.RefreshToken;
import com.ghartk.entity.Role;
import com.ghartk.entity.User;
import com.ghartk.exception.BadRequestException;
import com.ghartk.repository.RefreshTokenRepository;
import com.ghartk.repository.UserRepository;
import com.ghartk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new BadRequestException("Email already registered");
        if (userRepository.existsByPhone(request.getPhone()))
            throw new BadRequestException("Phone number already registered");
        User user = User.builder()
                .name(request.getName()).email(request.getEmail()).phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER).isActive(true).isVerified(true).build();
        userRepository.save(user);
        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmailOrPhone())
                .or(() -> userRepository.findByPhone(request.getEmailOrPhone()))
                .orElseThrow(() -> new BadRequestException("Invalid email/phone or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new BadRequestException("Invalid email/phone or password");
        if (!user.isActive())
            throw new BadRequestException("Account is deactivated. Please contact support.");
        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String identifier = user.getEmail() != null ? user.getEmail() : user.getPhone();
        String accessToken = jwtTokenProvider.generateAccessToken(identifier, user.getRole().name());
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(identifier);
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user).token(refreshTokenStr)
                .expiry(LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshExpirationMs() / 1000))
                .isRevoked(false).build();
        refreshTokenRepository.save(refreshToken);
        return AuthResponse.builder()
                .accessToken(accessToken).refreshToken(refreshTokenStr).tokenType("Bearer")
                .userId(user.getId()).name(user.getName()).email(user.getEmail())
                .phone(user.getPhone()).role(user.getRole()).profileImage(user.getProfileImage()).build();
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken token = refreshTokenRepository.findByTokenAndIsRevokedFalse(refreshTokenStr)
                .orElseThrow(() -> new BadRequestException("Invalid or expired refresh token"));
        if (token.getExpiry().isBefore(LocalDateTime.now())) {
            token.setRevoked(true); refreshTokenRepository.save(token);
            throw new BadRequestException("Refresh token expired");
        }
        return generateAuthResponse(token.getUser());
    }

    @Transactional
    public void logout(String refreshTokenStr) {
        refreshTokenRepository.findByTokenAndIsRevokedFalse(refreshTokenStr)
                .ifPresent(t -> { t.setRevoked(true); refreshTokenRepository.save(t); });
    }
}
