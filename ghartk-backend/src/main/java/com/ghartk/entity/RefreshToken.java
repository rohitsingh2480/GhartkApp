package com.ghartk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiry;

    @Column(name = "is_revoked")
    private boolean isRevoked = false;

    public RefreshToken() {}

    public RefreshToken(Long id, User user, String token, LocalDateTime expiry, boolean isRevoked) {
        this.id = id;
        this.user = user;
        this.token = token;
        this.expiry = expiry;
        this.isRevoked = isRevoked;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private User user; private String token;
        private LocalDateTime expiry; private boolean isRevoked = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder token(String token) { this.token = token; return this; }
        public Builder expiry(LocalDateTime expiry) { this.expiry = expiry; return this; }
        public Builder isRevoked(boolean isRevoked) { this.isRevoked = isRevoked; return this; }
        public RefreshToken build() {
            return new RefreshToken(id, user, token, expiry, isRevoked);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public LocalDateTime getExpiry() { return expiry; }
    public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }
    public boolean isRevoked() { return isRevoked; }
    public void setRevoked(boolean isRevoked) { this.isRevoked = isRevoked; }
}
