package com.ghartk.dto.request;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class ProductRequest {
    @NotNull private Long categoryId;
    @NotBlank private String name;
    private String description;
    private String imageUrl;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
    private BigDecimal mrp;
    @NotNull @Min(0) private Integer stockQty;
    private String unit;
    @JsonProperty("isAvailable")
    private Boolean isAvailable = true;

    @JsonProperty("isFeatured")
    private Boolean isFeatured = false;

    @JsonProperty("isVeg")
    private Boolean isVeg = true;

    public ProductRequest() {}

    public ProductRequest(Long categoryId, String name, String description, String imageUrl, BigDecimal price, BigDecimal mrp, Integer stockQty, String unit, Boolean isAvailable, Boolean isFeatured, Boolean isVeg) {
        this.categoryId = categoryId;
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
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
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
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }
    public boolean isAvailable() { return isAvailable != null ? isAvailable : true; }
    public boolean isFeatured() { return isFeatured != null ? isFeatured : false; }
    public boolean isVeg() { return isVeg != null ? isVeg : true; }
}
