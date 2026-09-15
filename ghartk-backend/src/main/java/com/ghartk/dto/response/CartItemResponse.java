package com.ghartk.dto.response;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private boolean isAvailable;
    private Integer stockQty;
    private boolean isVeg;

    public CartItemResponse() {}

    public CartItemResponse(Long id, Long productId, String productName, String productImage, BigDecimal unitPrice, Integer quantity, BigDecimal totalPrice, boolean isAvailable, Integer stockQty, boolean isVeg) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.isAvailable = isAvailable;
        this.stockQty = stockQty;
        this.isVeg = isVeg;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long productId; private String productName; private String productImage;
        private BigDecimal unitPrice; private Integer quantity; private BigDecimal totalPrice;
        private boolean isAvailable; private Integer stockQty; private boolean isVeg;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder productId(Long productId) { this.productId = productId; return this; }
        public Builder productName(String productName) { this.productName = productName; return this; }
        public Builder productImage(String productImage) { this.productImage = productImage; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }
        public Builder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder stockQty(Integer stockQty) { this.stockQty = stockQty; return this; }
        public Builder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public CartItemResponse build() {
            return new CartItemResponse(id, productId, productName, productImage, unitPrice, quantity, totalPrice, isAvailable, stockQty, isVeg);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean isAvailable) { this.isAvailable = isAvailable; }
    public Integer getStockQty() { return stockQty; }
    public void setStockQty(Integer stockQty) { this.stockQty = stockQty; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean isVeg) { this.isVeg = isVeg; }
}
