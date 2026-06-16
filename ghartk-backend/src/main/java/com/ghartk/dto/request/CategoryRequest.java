package com.ghartk.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank private String name;
    private String description;
    private String imageUrl;
    private String iconEmoji;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive = true;
    private Integer sortOrder = 0;
}
