package com.ghartk.dto.response;

import com.ghartk.entity.Role;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String profileImage;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;

    @com.fasterxml.jackson.annotation.JsonProperty("isVerified")
    private boolean isVerified;
    private LocalDateTime createdAt;
    private List<AddressResponse> addresses;
}
