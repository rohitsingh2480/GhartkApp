package com.ghartk.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "price_snapshot", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceSnapshot;

    public CartItem() {}

    public CartItem(Long id, Cart cart, Product product, Integer quantity, BigDecimal priceSnapshot) {
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.quantity = quantity != null ? quantity : 1;
        this.priceSnapshot = priceSnapshot;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Cart cart; private Product product;
        private Integer quantity = 1; private BigDecimal priceSnapshot;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder cart(Cart cart) { this.cart = cart; return this; }
        public Builder product(Product product) { this.product = product; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder priceSnapshot(BigDecimal priceSnapshot) { this.priceSnapshot = priceSnapshot; return this; }
        public CartItem build() {
            return new CartItem(id, cart, product, quantity, priceSnapshot);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPriceSnapshot() { return priceSnapshot; }
    public void setPriceSnapshot(BigDecimal priceSnapshot) { this.priceSnapshot = priceSnapshot; }
}
