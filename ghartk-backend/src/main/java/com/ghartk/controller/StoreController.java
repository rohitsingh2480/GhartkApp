package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.response.StoreResponse;
import com.ghartk.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getStores(
            @RequestParam(required = false) String pincode) {
        List<StoreResponse> stores = storeService.getStoresByPincode(pincode);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreResponse>> getStoreById(@PathVariable Long id) {
        StoreResponse store = storeService.getStoreById(id);
        return ResponseEntity.ok(ApiResponse.success(store));
    }
}
