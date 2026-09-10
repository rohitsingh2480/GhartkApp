package com.ghartk.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "icon_emoji")
    private String iconEmoji;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    public Category() {}

    public Category(Long id, String name, String description, String imageUrl, String iconEmoji, boolean isActive, Integer sortOrder, List<Product> products) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.iconEmoji = iconEmoji;
        this.isActive = isActive;
        this.sortOrder = sortOrder != null ? sortOrder : 0;
        this.products = products != null ? products : new ArrayList<>();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String name; private String description; private String imageUrl;
        private String iconEmoji; private boolean isActive = true; private Integer sortOrder = 0;
        private List<Product> products = new ArrayList<>();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder iconEmoji(String iconEmoji) { this.iconEmoji = iconEmoji; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public Builder products(List<Product> products) { this.products = products; return this; }
        public Category build() {
            return new Category(id, name, description, imageUrl, iconEmoji, isActive, sortOrder, products);
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
    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
}
