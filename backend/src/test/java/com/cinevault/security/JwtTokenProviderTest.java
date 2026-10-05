package com.cinevault.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        // Generate a valid 256-bit test secret (32 bytes base64 encoded)
        String secret = Base64.getEncoder().encodeToString("super-secret-key-for-cinevault-tests-1234567890".getBytes());
        long expirationMs = 3600000; // 1 hour
        jwtTokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    void shouldGenerateValidToken() {
        String token = jwtTokenProvider.generateToken(1L, "admin@cinevault.com", "ADMIN");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("admin@cinevault.com", jwtTokenProvider.getEmailFromToken(token));
        assertEquals("ADMIN", jwtTokenProvider.getRoleFromToken(token));
        assertEquals(1L, jwtTokenProvider.getUserIdFromToken(token));
    }

    @Test
    void shouldRejectInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.token.structure"));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void shouldExtractClaimsForRegularUser() {
        String token = jwtTokenProvider.generateToken(42L, "user@example.com", "USER");
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("user@example.com", jwtTokenProvider.getEmailFromToken(token));
        assertEquals("USER", jwtTokenProvider.getRoleFromToken(token));
        assertEquals(42L, jwtTokenProvider.getUserIdFromToken(token));
    }
}
