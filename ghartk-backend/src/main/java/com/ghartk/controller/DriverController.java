package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.response.*;
import com.ghartk.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DRIVER')")
public class DriverController {
    private final DriverService driverService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DriverDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        DriverDashboardResponse dashboard = driverService.getDriverDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @PutMapping("/status")
    public ResponseEntity<ApiResponse<DriverDashboardResponse>> toggleStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        DriverDashboardResponse dashboard = driverService.toggleOnlineStatus(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Driver online status updated", dashboard));
    }

    @PutMapping("/location")
    public ResponseEntity<ApiResponse<DriverDashboardResponse>> updateLocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Double> body) {
        Double lat = body.get("latitude");
        Double lng = body.get("longitude");
        DriverDashboardResponse dashboard = driverService.updateLocation(userDetails.getUsername(), lat, lng);
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully", dashboard));
    }

    @GetMapping("/orders/available")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAvailableOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<OrderResponse> orders = driverService.getAvailableOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/orders/{id}/accept")
    public ResponseEntity<ApiResponse<DeliveryResponse>> acceptOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        DeliveryResponse delivery = driverService.acceptOrder(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Order accepted and delivery assigned", delivery));
    }

    @PutMapping("/deliveries/{id}/status")
    public ResponseEntity<ApiResponse<DeliveryResponse>> updateDeliveryStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        DeliveryResponse delivery = driverService.updateDeliveryStatus(userDetails.getUsername(), id, status);
        return ResponseEntity.ok(ApiResponse.success("Delivery status updated successfully", delivery));
    }
}
