package com.ghartk.dto.response;

import com.ghartk.entity.Role;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String profileImage;
}
