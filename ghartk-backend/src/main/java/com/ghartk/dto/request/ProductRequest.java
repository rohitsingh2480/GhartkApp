package com.ghartk.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotNull private Long categoryId;
    @NotBlank private String name;
    private String description;
    private String imageUrl;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
    private BigDecimal mrp;
    @NotNull @Min(0) private Integer stockQty;
    private String unit;
    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    private boolean isAvailable = true;

    @com.fasterxml.jackson.annotation.JsonProperty("isFeatured")
    private boolean isFeatured = false;

    @com.fasterxml.jackson.annotation.JsonProperty("isVeg")
    private boolean isVeg = true;
}
