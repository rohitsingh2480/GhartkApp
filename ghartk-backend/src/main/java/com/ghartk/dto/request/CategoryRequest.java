package com.ghartk.dto.request;

import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoryRequest {
    @NotBlank private String name;
    private String description;
    private String imageUrl;
    private String iconEmoji;
    @JsonProperty("isActive")
    private boolean isActive = true;
    private Integer sortOrder = 0;

    public CategoryRequest() {}

    public CategoryRequest(String name, String description, String imageUrl, String iconEmoji, boolean isActive, Integer sortOrder) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.iconEmoji = iconEmoji;
        this.isActive = isActive;
        this.sortOrder = sortOrder;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getIconEmoji() { return iconEmoji; }
    public void setIconEmoji(String iconEmoji) { this.iconEmoji = iconEmoji; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
