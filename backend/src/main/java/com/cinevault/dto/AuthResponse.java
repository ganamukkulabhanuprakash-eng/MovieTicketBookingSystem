package com.cinevault.dto;

/**
 * Response DTO for authentication operations (login/register).
 * Contains user identity, role, and the JWT token for subsequent requests.
 * Password is NEVER included here.
 */
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String token;   // JWT — present on success, null on error
    private String message;

    public AuthResponse() {}

    public AuthResponse(Long id, String name, String email, String role, String token, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
        this.message = message;
    }

    // Convenience factory methods
    public static AuthResponse success(Long id, String name, String email, String role, String token) {
        return new AuthResponse(id, name, email, role, token, "Success");
    }

    public static AuthResponse error(String message) {
        AuthResponse response = new AuthResponse();
        response.setMessage(message);
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
