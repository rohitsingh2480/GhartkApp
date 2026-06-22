package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.request.CartItemRequest;
import com.ghartk.dto.response.CartResponse;
import com.ghartk.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(ud.getUsername())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal UserDetails ud, @Valid @RequestBody CartItemRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addItem(ud.getUsername(), req)));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @AuthenticationPrincipal UserDetails ud, @PathVariable Long id, @Valid @RequestBody CartItemRequest req) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateItem(ud.getUsername(), id, req)));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserDetails ud, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Item removed", cartService.removeItem(ud.getUsername(), id)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails ud) {
        cartService.clearCart(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
