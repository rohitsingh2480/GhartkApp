package com.ghartk.service;

import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;

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

  
}
