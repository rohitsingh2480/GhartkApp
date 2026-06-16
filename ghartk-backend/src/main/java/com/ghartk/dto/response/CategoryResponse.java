package com.ghartk.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String iconEmoji;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
    private Integer sortOrder;
    private long productCount;
}
