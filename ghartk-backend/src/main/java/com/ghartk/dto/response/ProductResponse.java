package com.ghartk.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

public class ProductResponse {
    private Long id;
    private Long storeId;
    private String storeName;
    private String storePincode;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer stockQty;
    private String unit;
    @JsonProperty("isAvailable")
    private boolean isAvailable;

    @JsonProperty("isFeatured")
    private boolean isFeatured;

    @JsonProperty("isVeg")
    private boolean isVeg;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;

    public ProductResponse() {}

    public ProductResponse(Long id, Long storeId, String storeName, String storePincode, Long categoryId, String categoryName, String name, String description, String imageUrl, BigDecimal price, BigDecimal mrp, Integer stockQty, String unit, boolean isAvailable, boolean isFeatured, boolean isVeg, Double rating, Integer reviewCount, LocalDateTime createdAt) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
        this.storePincode = storePincode;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.mrp = mrp;
        this.stockQty = stockQty;
        this.unit = unit;
        this.isAvailable = isAvailable;
        this.isFeatured = isFeatured;
        this.isVeg = isVeg;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long storeId; private String storeName; private String storePincode;
        private Long categoryId; private String categoryName; private String name;
        private String description; private String imageUrl; private BigDecimal price; private BigDecimal mrp;
        private Integer stockQty; private String unit; private boolean isAvailable; private boolean isFeatured;
        private boolean isVeg; private Double rating; private Integer reviewCount; private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder storeName(String storeName) { this.storeName = storeName; return this; }
        public Builder storePincode(String storePincode) { this.storePincode = storePincode; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder mrp(BigDecimal mrp) { this.mrp = mrp; return this; }
        public Builder stockQty(Integer stockQty) { this.stockQty = stockQty; return this; }
        public Builder unit(String unit) { this.unit = unit; return this; }
        public Builder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder isFeatured(boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public Builder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder reviewCount(Integer reviewCount) { this.reviewCount = reviewCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProductResponse build() {
            return new ProductResponse(id, storeId, storeName, storePincode, categoryId, categoryName, name, description, imageUrl, price, mrp, stockQty, unit, isAvailable, isFeatured, isVeg, rating, reviewCount, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    public String getStorePincode() { return storePincode; }
    public void setStorePincode(String storePincode) { this.storePincode = storePincode; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getMrp() { return mrp; }
    public void setMrp(BigDecimal mrp) { this.mrp = mrp; }
    public Integer getStockQty() { return stockQty; }
    public void setStockQty(Integer stockQty) { this.stockQty = stockQty; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean isFeatured) { this.isFeatured = isFeatured; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean isVeg) { this.isVeg = isVeg; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getDiscountPercent() {
        if (mrp != null && mrp.compareTo(BigDecimal.ZERO) > 0 && price != null && price.compareTo(mrp) < 0) {
            return mrp.subtract(price).multiply(BigDecimal.valueOf(100))
                    .divide(mrp, 0, RoundingMode.HALF_UP).intValue();
        }
        return 0;
    }
}
