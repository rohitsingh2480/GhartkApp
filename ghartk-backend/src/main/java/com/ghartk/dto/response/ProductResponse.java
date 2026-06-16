package com.ghartk.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer stockQty;
    private String unit;
    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    private boolean isAvailable;

    @com.fasterxml.jackson.annotation.JsonProperty("isFeatured")
    private boolean isFeatured;

    @com.fasterxml.jackson.annotation.JsonProperty("isVeg")
    private boolean isVeg;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;

    public Integer getDiscountPercent() {
        if (mrp != null && mrp.compareTo(BigDecimal.ZERO) > 0 && price != null && price.compareTo(mrp) < 0) {
            return mrp.subtract(price).multiply(BigDecimal.valueOf(100))
                    .divide(mrp, 0, RoundingMode.HALF_UP).intValue();
        }
        return 0;
    }
}
