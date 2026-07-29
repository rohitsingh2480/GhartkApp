package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.response.*;
import com.ghartk.service.MerchantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/merchant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantController {
    private final MerchantService merchantService;
    
    // We default to Store ID 1L for Phase 2 single-store context
    private static final Long DEFAULT_STORE_ID = 1L;

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderResponse> orders = merchantService.getOrders(DEFAULT_STORE_ID, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        OrderResponse updated = merchantService.updateOrderStatus(DEFAULT_STORE_ID, id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductResponse> products = merchantService.getProducts(DEFAULT_STORE_ID, categoryId, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStock(
            @PathVariable Long id, 
            @RequestBody Map<String, Integer> body) {
        Integer stockQty = body.get("stockQty");
        ProductResponse updated = merchantService.updateProductStock(DEFAULT_STORE_ID, id, stockQty);
        return ResponseEntity.ok(ApiResponse.success("Stock quantity updated successfully", updated));
    }

    @PutMapping("/products/{id}/toggle-availability")
    public ResponseEntity<ApiResponse<ProductResponse>> toggleProductAvailability(
            @PathVariable Long id) {
        ProductResponse updated = merchantService.toggleProductAvailability(DEFAULT_STORE_ID, id);
        return ResponseEntity.ok(ApiResponse.success("Product availability updated", updated));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<MerchantAnalyticsResponse>> getAnalytics() {
        MerchantAnalyticsResponse analytics = merchantService.getAnalytics(DEFAULT_STORE_ID);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
