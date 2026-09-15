package com.ghartk.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private int itemCount;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal packagingFee;
    private BigDecimal total;
    private boolean freeDelivery;

    public CartResponse() {}

    public CartResponse(Long cartId, List<CartItemResponse> items, int itemCount, BigDecimal subtotal, BigDecimal deliveryFee, BigDecimal packagingFee, BigDecimal total, boolean freeDelivery) {
        this.cartId = cartId;
        this.items = items;
        this.itemCount = itemCount;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.packagingFee = packagingFee;
        this.total = total;
        this.freeDelivery = freeDelivery;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long cartId; private List<CartItemResponse> items; private int itemCount;
        private BigDecimal subtotal; private BigDecimal deliveryFee; private BigDecimal packagingFee;
        private BigDecimal total; private boolean freeDelivery;

        public Builder cartId(Long cartId) { this.cartId = cartId; return this; }
        public Builder items(List<CartItemResponse> items) { this.items = items; return this; }
        public Builder itemCount(int itemCount) { this.itemCount = itemCount; return this; }
        public Builder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public Builder deliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; return this; }
        public Builder packagingFee(BigDecimal packagingFee) { this.packagingFee = packagingFee; return this; }
        public Builder total(BigDecimal total) { this.total = total; return this; }
        public Builder freeDelivery(boolean freeDelivery) { this.freeDelivery = freeDelivery; return this; }
        public CartResponse build() {
            return new CartResponse(cartId, items, itemCount, subtotal, deliveryFee, packagingFee, total, freeDelivery);
        }
    }

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }
    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
    public int getItemCount() { return itemCount; }
    public void setItemCount(int itemCount) { this.itemCount = itemCount; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }
    public BigDecimal getPackagingFee() { return packagingFee; }
    public void setPackagingFee(BigDecimal packagingFee) { this.packagingFee = packagingFee; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public boolean isFreeDelivery() { return freeDelivery; }
    public void setFreeDelivery(boolean freeDelivery) { this.freeDelivery = freeDelivery; }
}
