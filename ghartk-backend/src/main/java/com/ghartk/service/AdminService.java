package com.ghartk.service;

import com.ghartk.dto.request.OnboardMerchantRequest;
import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;
    private final StoreService storeService;
    private final PasswordEncoder passwordEncoder;

    public DashboardResponse getDashboard() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<OrderResponse> recentOrders = orderRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 10))
                .map(orderService::mapToResponse).getContent();
        return DashboardResponse.builder()
                .totalUsers(userRepository.countByRole(Role.CUSTOMER))
                .totalOrders(orderRepository.count())
                .todaysOrders(orderRepository.countTodaysOrders(startOfDay))
                .totalRevenue(orderRepository.getTotalRevenue())
                .todaysRevenue(orderRepository.getTodaysRevenue(startOfDay))
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PLACED) +
                        orderRepository.countByStatus(OrderStatus.CONFIRMED) +
                        orderRepository.countByStatus(OrderStatus.PREPARING))
                .deliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED))
                .totalProducts(productRepository.countByIsAvailableTrue())
                .lowStockCount(productRepository.findByStockQtyLessThanAndIsAvailableTrue(10).size())
                .recentOrders(recentOrders).build();
    }

    public Page<OrderResponse> getAllOrders(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null && !status.isEmpty()) {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus, pageable).map(orderService::mapToResponse);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(orderService::mapToResponse);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }
        return orderService.mapToResponse(orderRepository.save(order));
    }

    public Page<UserResponse> getAllUsers(int page, int size, String query) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = (query != null && !query.isEmpty())
                ? userRepository.searchCustomers(query, pageable)
                : userRepository.findByRole(Role.CUSTOMER, pageable);
        return users.map(userService::mapToUserResponse);
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public List<ProductResponse> getLowStockProducts() {
        return productService.getLowStockProducts();
    }

    // ── Multi-Merchant Onboarding ──────────────────────────────────────────

    @Transactional
    public StoreResponse onboardMerchantAndStore(OnboardMerchantRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("A user with this email already exists: " + req.getEmail());
        }
        if (storeRepository.existsByName(req.getStoreName())) {
            throw new BadRequestException("A store with this name already exists: " + req.getStoreName());
        }

        // 1. Create Merchant User Account
        User merchant = User.builder()
                .name(req.getMerchantName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.MERCHANT)
                .isActive(true)
                .build();
        merchant = userRepository.save(merchant);

        // 2. Create & link Store to Merchant
        Store store = Store.builder()
                .merchantUserId(merchant.getId())
                .name(req.getStoreName())
                .description(req.getStoreDescription())
                .logoUrl(req.getLogoUrl())
                .addressLine1(req.getAddressLine1())
                .city(req.getCity() != null ? req.getCity() : "Dehradun")
                .pincode(req.getPincode())
                .isActive(true)
                .build();
        store = storeRepository.save(store);

        return storeService.mapToResponse(store);
    }

    public List<StoreResponse> getAllStores() {
        return storeRepository.findByIsActiveTrue().stream()
                .map(storeService::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreResponse toggleStoreStatus(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", storeId));
        store.setActive(!store.isActive());
        return storeService.mapToResponse(storeRepository.save(store));
    }
}
