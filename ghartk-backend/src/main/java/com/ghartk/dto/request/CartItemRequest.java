package com.ghartk.dto.request;

import jakarta.validation.constraints.*;

public class CartItemRequest {
    @NotNull private Long productId;
    @NotNull @Min(0) private Integer quantity;

    public CartItemRequest() {}

    public CartItemRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
