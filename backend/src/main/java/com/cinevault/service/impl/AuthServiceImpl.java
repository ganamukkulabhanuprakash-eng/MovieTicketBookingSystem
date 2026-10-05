package com.cinevault.service.impl;

import com.cinevault.dto.AuthResponse;
import com.cinevault.dto.LoginRequest;
import com.cinevault.dto.RegisterRequest;
import com.cinevault.entity.User;
import com.cinevault.entity.enums.UserRole;
import com.cinevault.exception.DuplicateEmailException;
import com.cinevault.repository.UserRepository;
import com.cinevault.security.JwtTokenProvider;
import com.cinevault.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication service implementation.
 * Demonstrates: Interface implementation, Encapsulation, String handling,
 * Exception handling, Constructor injection.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Normalize email
        String email = request.getEmail().toLowerCase().trim();

        // Check for duplicate email
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException(email);
        }

        // Create new user with hashed password
        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword())
        );
        // Role always defaults to USER; ADMIN cannot be chosen via public registration
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);

        // Generate token immediately so the user is logged in after register
        String token = jwtTokenProvider.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return AuthResponse.success(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                token
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Invalid email or password");
        }

        if (!user.isActive()) {
            return AuthResponse.error("Account is deactivated. Please contact support.");
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.success(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                token
        );
    }
}
