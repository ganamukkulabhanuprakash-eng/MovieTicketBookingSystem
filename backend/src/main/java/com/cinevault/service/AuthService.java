package com.cinevault.service;

import com.cinevault.dto.AuthResponse;
import com.cinevault.dto.LoginRequest;
import com.cinevault.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
