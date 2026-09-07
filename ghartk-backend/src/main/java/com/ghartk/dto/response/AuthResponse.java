package com.ghartk.dto.response;

import com.ghartk.entity.Role;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String profileImage;
    private String defaultPincode;
    private String defaultCity;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, String tokenType, Long userId, String name, String email, String phone, Role role, String profileImage, String defaultPincode, String defaultCity) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.profileImage = profileImage;
        this.defaultPincode = defaultPincode;
        this.defaultCity = defaultCity;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String accessToken; private String refreshToken; private String tokenType = "Bearer";
        private Long userId; private String name; private String email; private String phone;
        private Role role; private String profileImage; private String defaultPincode; private String defaultCity;

        public Builder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public Builder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder profileImage(String profileImage) { this.profileImage = profileImage; return this; }
        public Builder defaultPincode(String defaultPincode) { this.defaultPincode = defaultPincode; return this; }
        public Builder defaultCity(String defaultCity) { this.defaultCity = defaultCity; return this; }
        public AuthResponse build() {
            return new AuthResponse(accessToken, refreshToken, tokenType, userId, name, email, phone, role, profileImage, defaultPincode, defaultCity);
        }
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public String getDefaultPincode() { return defaultPincode; }
    public void setDefaultPincode(String defaultPincode) { this.defaultPincode = defaultPincode; }
    public String getDefaultCity() { return defaultCity; }
    public void setDefaultCity(String defaultCity) { this.defaultCity = defaultCity; }
}
