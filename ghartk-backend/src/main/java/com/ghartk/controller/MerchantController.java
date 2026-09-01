package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.request.ProductRequest;
import com.ghartk.dto.response.*;
import com.ghartk.entity.Store;
import com.ghartk.entity.User;
import com.ghartk.service.MerchantService;
import com.ghartk.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/merchant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantController {
    private final MerchantService merchantService;
    private final StoreService storeService;

    // ── Store Info ─────────────────────────────────────────────────────────

    @GetMapping("/store")
    public ResponseEntity<ApiResponse<StoreResponse>> getMyStore(@AuthenticationPrincipal User user) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success(storeService.mapToResponse(store)));
    }

    // ── Orders ─────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String status) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(merchantService.getOrders(store.getId(), status, pageable)));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Order status updated",
                merchantService.updateOrderStatus(store.getId(), id, body.get("status"))));
    }

    // ── Products ───────────────────────────────────────────────────────────

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(merchantService.getProducts(store.getId(), categoryId, query, pageable)));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal User user,
            @RequestBody ProductRequest req) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Product added to store catalog",
                merchantService.createProduct(store.getId(), req)));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody ProductRequest req) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Product updated",
                merchantService.updateProduct(store.getId(), id, req)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        merchantService.deleteProduct(store.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Product removed from store", null));
    }

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStock(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Stock updated",
                merchantService.updateProductStock(store.getId(), id, body.get("stockQty"))));
    }

    @PutMapping("/products/{id}/price")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductPrice(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        BigDecimal price = new BigDecimal(body.get("price").toString());
        return ResponseEntity.ok(ApiResponse.success("Price updated",
                merchantService.updateProductPrice(store.getId(), id, price)));
    }

    @PutMapping("/products/{id}/toggle-availability")
    public ResponseEntity<ApiResponse<ProductResponse>> toggleProductAvailability(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Availability updated",
                merchantService.toggleProductAvailability(store.getId(), id)));
    }

    // ── Analytics ──────────────────────────────────────────────────────────

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<MerchantAnalyticsResponse>> getAnalytics(
            @AuthenticationPrincipal User user) {
        Store store = merchantService.getStoreForMerchant(user.getId());
        return ResponseEntity.ok(ApiResponse.success(merchantService.getAnalytics(store.getId())));
    }
}
