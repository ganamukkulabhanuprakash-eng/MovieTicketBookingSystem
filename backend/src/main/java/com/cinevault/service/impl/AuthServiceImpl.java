package com.cinevault.service.impl;

import com.cinevault.dto.AuthResponse;
import com.cinevault.dto.LoginRequest;
import com.cinevault.dto.RegisterRequest;
import com.cinevault.entity.User;
import com.cinevault.entity.enums.UserRole;
import com.cinevault.exception.DuplicateEmailException;
import com.cinevault.repository.UserRepository;
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

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        // Create new user with hashed password
        User user = new User(
                request.getName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword())
        );
        // Role defaults to USER; ADMIN is never assignable via registration

        User savedUser = userRepository.save(user);

        return AuthResponse.success(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Invalid email or password");
        }

        if (!user.isActive()) {
            return AuthResponse.error("Account is deactivated");
        }

        return AuthResponse.success(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
