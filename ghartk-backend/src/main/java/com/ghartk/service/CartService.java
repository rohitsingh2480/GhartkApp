package com.ghartk.service;

import com.ghartk.dto.request.CartItemRequest;
import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    private static final BigDecimal DELIVERY_FEE = new BigDecimal("49.00");
    private static final BigDecimal FREE_DELIVERY_THRESHOLD = new BigDecimal("499.00");
    private static final BigDecimal PACKAGING_FEE = new BigDecimal("10.00");

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() ->
                cartRepository.save(Cart.builder().user(user).build()));
    }

    public CartResponse getCart(String emailOrPhone) {
        User user = userService.getUserEntity(emailOrPhone);
        Cart cart = getOrCreateCart(user);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String emailOrPhone, CartItemRequest request) {
        User user = userService.getUserEntity(emailOrPhone);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));
        if (!product.isAvailable()) throw new BadRequestException("Product is currently unavailable");
        if (product.getStockQty() < request.getQuantity())
            throw new BadRequestException("Only " + product.getStockQty() + " items available in stock");
        Cart cart = getOrCreateCart(user);
        CartItem existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId()).orElse(null);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            existing.setPriceSnapshot(product.getPrice());
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart).product(product).quantity(request.getQuantity())
                    .priceSnapshot(product.getPrice()).build();
            cart.getItems().add(newItem);
        }
        return buildCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(String emailOrPhone, Long itemId, CartItemRequest request) {
        User user = userService.getUserEntity(emailOrPhone);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        CartItem item = cartItemRepository.findById(itemId)
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }
        return buildCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(String emailOrPhone, Long itemId) {
        User user = userService.getUserEntity(emailOrPhone);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartItemRepository.deleteById(itemId);
        return buildCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String emailOrPhone) {
        User user = userService.getUserEntity(emailOrPhone);
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    public Cart getCartEntity(String emailOrPhone) {
        User user = userService.getUserEntity(emailOrPhone);
        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            BigDecimal total = item.getPriceSnapshot().multiply(BigDecimal.valueOf(item.getQuantity()));
            return CartItemResponse.builder()
                    .id(item.getId()).productId(item.getProduct().getId())
                    .productName(item.getProduct().getName()).productImage(item.getProduct().getImageUrl())
                    .unitPrice(item.getPriceSnapshot()).quantity(item.getQuantity()).totalPrice(total)
                    .isAvailable(item.getProduct().isAvailable()).stockQty(item.getProduct().getStockQty())
                    .isVeg(item.getProduct().isVeg()).build();
        }).collect(Collectors.toList());
        BigDecimal subtotal = items.stream().map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        boolean freeDelivery = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0;
        BigDecimal deliveryFee = freeDelivery ? BigDecimal.ZERO : DELIVERY_FEE;
        BigDecimal packagingFee = items.isEmpty() ? BigDecimal.ZERO : PACKAGING_FEE;
        BigDecimal total = subtotal.add(deliveryFee).add(packagingFee);
        return CartResponse.builder()
                .cartId(cart.getId()).items(items)
                .itemCount(items.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .subtotal(subtotal).deliveryFee(deliveryFee).packagingFee(packagingFee)
                .total(total).freeDelivery(freeDelivery).build();
    }
}
