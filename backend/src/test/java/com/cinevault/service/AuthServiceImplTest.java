package com.cinevault.service;

import com.cinevault.dto.AuthResponse;
import com.cinevault.dto.LoginRequest;
import com.cinevault.dto.RegisterRequest;
import com.cinevault.entity.User;
import com.cinevault.entity.enums.UserRole;
import com.cinevault.exception.DuplicateEmailException;
import com.cinevault.repository.UserRepository;
import com.cinevault.security.JwtTokenProvider;
import com.cinevault.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AuthServiceImplTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        String secret = java.util.Base64.getEncoder().encodeToString("super-secret-key-for-cinevault-tests-1234567890".getBytes());
        jwtTokenProvider = new JwtTokenProvider(secret, 3600000L);
        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    void register_ShouldHashPasswordAndAssignUserRole() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test Student");
        req.setEmail("student@college.edu");
        req.setPassword("plainPassword123");

        when(userRepository.existsByEmail("student@college.edu")).thenReturn(false);

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(101L);
            return u;
        });

        AuthResponse resp = authService.register(req);

        // Verification
        assertNotNull(resp);
        assertEquals(101L, resp.getId());
        assertEquals("student@college.edu", resp.getEmail());
        assertEquals("USER", resp.getRole());
        assertNotNull(resp.getToken());
        assertTrue(jwtTokenProvider.validateToken(resp.getToken()));

        // Verify password was hashed (never plain text)
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertNotEquals("plainPassword123", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("plainPassword123", savedUser.getPassword()));
        assertEquals(UserRole.USER, savedUser.getRole());
    }

    @Test
    void register_ShouldRejectDuplicateEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Another User");
        req.setEmail("existing@gmail.com");
        req.setPassword("pass12345");

        when(userRepository.existsByEmail("existing@gmail.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldSucceedWithValidCredentials() {
        String hashed = passwordEncoder.encode("correctPassword");
        User user = new User("Jane Doe", "jane@example.com", hashed, UserRole.USER);
        user.setId(5L);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("jane@example.com");
        req.setPassword("correctPassword");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals(5L, resp.getId());
        assertEquals("USER", resp.getRole());
        assertNotNull(resp.getToken());
        assertTrue(jwtTokenProvider.validateToken(resp.getToken()));
    }

    @Test
    void login_ShouldFailWithInvalidPassword() {
        String hashed = passwordEncoder.encode("correctPassword");
        User user = new User("Jane Doe", "jane@example.com", hashed, UserRole.USER);
        user.setId(5L);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("jane@example.com");
        req.setPassword("wrongPassword");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertNull(resp.getId());
        assertEquals("Invalid email or password", resp.getMessage());
    }

    @Test
    void login_ShouldRejectDeactivatedAccount() {
        String hashed = passwordEncoder.encode("correctPassword");
        User user = new User("Jane Doe", "jane@example.com", hashed, UserRole.USER);
        user.setId(5L);
        user.setActive(false); // deactivated

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("jane@example.com");
        req.setPassword("correctPassword");

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertNull(resp.getId());
        assertTrue(resp.getMessage().contains("deactivated"));
    }
}
