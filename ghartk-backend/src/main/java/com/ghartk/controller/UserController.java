package com.ghartk.controller;

import com.ghartk.dto.ApiResponse;
import com.ghartk.dto.request.*;
import com.ghartk.dto.response.*;
import com.ghartk.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser(ud.getUsername())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails ud, @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(ud.getUsername(), req)));
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAddresses(ud.getUsername())));
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @AuthenticationPrincipal UserDetails ud, @Valid @RequestBody AddressRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Address added", userService.addAddress(ud.getUsername(), req)));
    }

    @PutMapping("/me/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal UserDetails ud, @PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Address updated", userService.updateAddress(ud.getUsername(), id, req)));
    }

    @DeleteMapping("/me/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@AuthenticationPrincipal UserDetails ud, @PathVariable Long id) {
        userService.deleteAddress(ud.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }
}
