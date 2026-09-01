package com.ghartk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StoreResponse {
    private Long id;
    private Long merchantUserId;
    private String merchantName;
    private String merchantEmail;
    private String merchantPhone;
    private String name;
    private String description;
    private String logoUrl;
    private String addressLine1;
    private String city;
    private String pincode;
    private boolean isActive;
    private LocalDateTime createdAt;
}
