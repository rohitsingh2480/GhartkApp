package com.ghartk.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String iconEmoji;
    @JsonProperty("isActive")
    private boolean isActive;
    private Integer sortOrder;
    private long productCount;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description, String imageUrl, String iconEmoji, boolean isActive, Integer sortOrder, long productCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.iconEmoji = iconEmoji;
        this.isActive = isActive;
        this.sortOrder = sortOrder;
        this.productCount = productCount;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String name; private String description; private String imageUrl;
        private String iconEmoji; private boolean isActive; private Integer sortOrder; private long productCount;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder iconEmoji(String iconEmoji) { this.iconEmoji = iconEmoji; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public Builder productCount(long productCount) { this.productCount = productCount; return this; }
        public CategoryResponse build() {
            return new CategoryResponse(id, name, description, imageUrl, iconEmoji, isActive, sortOrder, productCount);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public long getProductCount() { return productCount; }
    public void setProductCount(long productCount) { this.productCount = productCount; }
}
