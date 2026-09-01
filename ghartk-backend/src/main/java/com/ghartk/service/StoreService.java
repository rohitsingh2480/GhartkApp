package com.ghartk.service;

import com.ghartk.dto.response.StoreResponse;
import com.ghartk.entity.Store;
import com.ghartk.entity.User;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.StoreRepository;
import com.ghartk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public List<StoreResponse> getStoresByPincode(String pincode) {
        List<Store> stores = (pincode != null && !pincode.trim().isEmpty())
                ? storeRepository.findByPincodeAndIsActiveTrue(pincode.trim())
                : storeRepository.findByIsActiveTrue();
        return stores.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public StoreResponse getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", id));
        return mapToResponse(store);
    }

    public StoreResponse mapToResponse(Store store) {
        User merchant = store.getMerchantUserId() != null ? userRepository.findById(store.getMerchantUserId()).orElse(null) : null;
        return StoreResponse.builder()
                .id(store.getId())
                .merchantUserId(store.getMerchantUserId())
                .merchantName(merchant != null ? merchant.getName() : "Merchant")
                .merchantEmail(merchant != null ? merchant.getEmail() : null)
                .merchantPhone(merchant != null ? merchant.getPhone() : null)
                .name(store.getName())
                .description(store.getDescription())
                .logoUrl(store.getLogoUrl())
                .addressLine1(store.getAddressLine1())
                .city(store.getCity())
                .pincode(store.getPincode())
                .isActive(store.isActive())
                .createdAt(store.getCreatedAt())
                .build();
    }
}
