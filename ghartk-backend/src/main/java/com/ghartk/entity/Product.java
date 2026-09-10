package com.ghartk.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_id")
    private Long storeId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "stock_qty")
    private Integer stockQty = 0;

    private String unit;

    @Column(name = "is_available")
    private boolean isAvailable = true;

    @Column(name = "is_featured")
    private boolean isFeatured = false;

    @Column(name = "is_veg")
    private boolean isVeg = true;

    private Double rating = 4.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Product() {}

    public Product(Long id, Long storeId, Category category, String name, String description, String imageUrl, BigDecimal price, BigDecimal mrp, Integer stockQty, String unit, boolean isAvailable, boolean isFeatured, boolean isVeg, Double rating, Integer reviewCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.storeId = storeId;
        this.category = category;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.mrp = mrp;
        this.stockQty = stockQty != null ? stockQty : 0;
        this.unit = unit;
        this.isAvailable = isAvailable;
        this.isFeatured = isFeatured;
        this.isVeg = isVeg;
        this.rating = rating != null ? rating : 4.0;
        this.reviewCount = reviewCount != null ? reviewCount : 0;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long storeId; private Category category; private String name;
        private String description; private String imageUrl; private BigDecimal price; private BigDecimal mrp;
        private Integer stockQty = 0; private String unit; private boolean isAvailable = true;
        private boolean isFeatured = false; private boolean isVeg = true; private Double rating = 4.0;
        private Integer reviewCount = 0; private LocalDateTime createdAt; private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder storeId(Long storeId) { this.storeId = storeId; return this; }
        public Builder category(Category category) { this.category = category; return this; }
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
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Product build() {
            return new Product(id, storeId, category, name, description, imageUrl, price, mrp, stockQty, unit, isAvailable, isFeatured, isVeg, rating, reviewCount, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
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
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
