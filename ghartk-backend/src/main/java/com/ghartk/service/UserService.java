package com.ghartk.service;

import com.ghartk.dto.request.AddressRequest;
import com.ghartk.dto.request.UpdateProfileRequest;
import com.ghartk.dto.response.AddressResponse;
import com.ghartk.dto.response.UserResponse;
import com.ghartk.entity.Address;
import com.ghartk.entity.User;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.AddressRepository;
import com.ghartk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public User getUserEntity(String emailOrPhone) {
        return userRepository.findByEmail(emailOrPhone)
                .or(() -> userRepository.findByPhone(emailOrPhone))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getCurrentUser(String emailOrPhone) {
        return mapToUserResponse(getUserEntity(emailOrPhone));
    }

    @Transactional
    public UserResponse updateProfile(String emailOrPhone, UpdateProfileRequest request) {
        User user = getUserEntity(emailOrPhone);
        if (request.getName() != null) user.setName(request.getName());
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());
        return mapToUserResponse(userRepository.save(user));
    }

    public List<AddressResponse> getAddresses(String emailOrPhone) {
        User user = getUserEntity(emailOrPhone);
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToAddressResponse).collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse addAddress(String emailOrPhone, AddressRequest request) {
        User user = getUserEntity(emailOrPhone);
        if (request.isDefault()) {
            addressRepository.findByUserIdAndIsDefault(user.getId(), true)
                    .ifPresent(a -> { a.setDefault(false); addressRepository.save(a); });
        }
        Address address = Address.builder()
                .user(user).label(request.getLabel()).line1(request.getLine1())
                .line2(request.getLine2()).city(request.getCity()).state(request.getState())
                .pincode(request.getPincode()).lat(request.getLat()).lng(request.getLng())
                .isDefault(request.isDefault()).build();
        return mapToAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(String emailOrPhone, Long addressId, AddressRequest request) {
        User user = getUserEntity(emailOrPhone);
        Address address = addressRepository.findById(addressId)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));
        if (request.isDefault()) {
            addressRepository.findByUserIdAndIsDefault(user.getId(), true)
                    .ifPresent(a -> { if (!a.getId().equals(addressId)) { a.setDefault(false); addressRepository.save(a); } });
        }
        address.setLabel(request.getLabel()); address.setLine1(request.getLine1());
        address.setLine2(request.getLine2()); address.setCity(request.getCity());
        address.setState(request.getState()); address.setPincode(request.getPincode());
        address.setLat(request.getLat()); address.setLng(request.getLng());
        address.setDefault(request.isDefault());
        return mapToAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String emailOrPhone, Long addressId) {
        User user = getUserEntity(emailOrPhone);
        addressRepository.deleteByIdAndUserId(addressId, user.getId());
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId()).name(user.getName()).email(user.getEmail())
                .phone(user.getPhone()).role(user.getRole()).profileImage(user.getProfileImage())
                .isActive(user.isActive()).isVerified(user.isVerified()).createdAt(user.getCreatedAt())
                .addresses(addressRepository.findByUserId(user.getId()).stream()
                        .map(this::mapToAddressResponse).collect(Collectors.toList()))
                .build();
    }

    public AddressResponse mapToAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId()).label(address.getLabel()).line1(address.getLine1())
                .line2(address.getLine2()).city(address.getCity()).state(address.getState())
                .pincode(address.getPincode()).lat(address.getLat()).lng(address.getLng())
                .isDefault(address.isDefault()).build();
    }
}
