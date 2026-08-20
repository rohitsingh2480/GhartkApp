package com.ghartk.service;

import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.event.OrderStateChangeEvent;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MerchantService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;
    private final ProductService productService;
    private final ApplicationEventPublisher eventPublisher;

    public Page<OrderResponse> getOrders(Long storeId, String status, Pageable pageable) {
        if (status != null && !status.trim().isEmpty()) {
            try {
                if (status.contains(",")) {
                    List<OrderStatus> statuses = java.util.Arrays.stream(status.split(","))
                            .map(s -> OrderStatus.valueOf(s.trim().toUpperCase()))
                            .collect(Collectors.toList());
                    return orderRepository.findByStoreIdAndStatusInOrderByCreatedAtDesc(storeId, statuses, pageable)
                            .map(orderService::mapToResponse);
                }
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                return orderRepository.findByStoreIdAndStatusOrderByCreatedAtDesc(storeId, orderStatus, pageable)
                        .map(orderService::mapToResponse);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid order status: " + status);
            }
        }
        return orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId, pageable)
                .map(orderService::mapToResponse);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long storeId, Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        if (order.getStoreId() == null || !order.getStoreId().equals(storeId)) {
            throw new BadRequestException("Order does not belong to this store");
        }
        try {
            OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
            order.setStatus(status);
            Order saved = orderRepository.save(order);
            
            // Publish OrderStateChangeEvent here
            eventPublisher.publishEvent(new OrderStateChangeEvent(saved));
            
            return orderService.mapToResponse(saved);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + statusStr);
        }
    }

    public Page<ProductResponse> getProducts(Long storeId, Long categoryId, String query, Pageable pageable) {
        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return productRepository.findByStoreIdWithFilters(storeId, categoryId, q, pageable)
                .map(productService::mapToResponse);
    }

    @Transactional
    public ProductResponse updateProductStock(Long storeId, Long productId, Integer stockQty) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        if (product.getStoreId() == null || !product.getStoreId().equals(storeId)) {
            throw new BadRequestException("Product does not belong to this store");
        }
        if (stockQty < 0) {
            throw new BadRequestException("Stock quantity cannot be negative");
        }
        product.setStockQty(stockQty);
        return productService.mapToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse toggleProductAvailability(Long storeId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        if (product.getStoreId() == null || !product.getStoreId().equals(storeId)) {
            throw new BadRequestException("Product does not belong to this store");
        }
        product.setAvailable(!product.isAvailable());
        return productService.mapToResponse(productRepository.save(product));
    }

    public MerchantAnalyticsResponse getAnalytics(Long storeId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        
        long totalOrders = orderRepository.countByStoreId(storeId);
        long todaysOrders = orderRepository.countTodaysOrdersByStoreId(storeId, startOfDay);
        BigDecimal totalRevenue = orderRepository.getTotalRevenueByStoreId(storeId);
        BigDecimal todaysRevenue = orderRepository.getTodaysRevenueByStoreId(storeId, startOfDay);
        
        long pendingOrders = orderRepository.countByStoreIdAndStatus(storeId, OrderStatus.PLACED) +
                             orderRepository.countByStoreIdAndStatus(storeId, OrderStatus.CONFIRMED);
        long preparingOrders = orderRepository.countByStoreIdAndStatus(storeId, OrderStatus.PREPARING);
        long completedOrders = orderRepository.countByStoreIdAndStatus(storeId, OrderStatus.DELIVERED);
        
        // Count products and low stock products
        // For our single-store context, get all products belonging to storeId
        Page<Product> productsPage = productRepository.findByStoreIdWithFilters(storeId, null, null, PageRequest.of(0, 1));
        long totalProducts = productsPage.getTotalElements();
        
        List<ProductResponse> lowStock = productRepository.findByStockQtyLessThanAndIsAvailableTrue(10)
                .stream()
                .filter(p -> p.getStoreId() == null || p.getStoreId().equals(storeId))
                .map(productService::mapToResponse)
                .collect(Collectors.toList());
                
        // Fetch active orders (not delivered and not cancelled)
        Pageable activeOrdersPageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        List<OrderResponse> activeOrders = orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId, activeOrdersPageable)
                .stream()
                .filter(o -> !o.getStatus().equals(OrderStatus.DELIVERED) && !o.getStatus().equals(OrderStatus.CANCELLED))
                .map(orderService::mapToResponse)
                .collect(Collectors.toList());

        return MerchantAnalyticsResponse.builder()
                .totalOrders(totalOrders)
                .todaysOrders(todaysOrders)
                .totalRevenue(totalRevenue)
                .todaysRevenue(todaysRevenue)
                .pendingOrders(pendingOrders)
                .preparingOrders(preparingOrders)
                .completedOrders(completedOrders)
                .totalProducts(totalProducts)
                .lowStockCount(lowStock.size())
                .activeOrders(activeOrders)
                .build();
    }

    @Transactional
    public ProductResponse updateProductPrice(Long storeId, Long productId, java.math.BigDecimal price) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        if (product.getStoreId() == null || !product.getStoreId().equals(storeId)) {
            throw new BadRequestException("Product does not belong to this store");
        }
        if (price == null || price.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }
        product.setPrice(price);
        return productService.mapToResponse(productRepository.save(product));
    }
}
