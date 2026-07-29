package com.ghartk.service;

import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.event.OrderStateChangeEvent;
import com.ghartk.repository.*;
import com.ghartk.websocket.LocationHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DriverService {
    private final DriverRepository driverRepository;
    private final DeliveryRepository deliveryRepository;
    private final DriverEarningsRepository driverEarningsRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final OrderService orderService;
    private final ApplicationEventPublisher eventPublisher;
    private final LocationHandler locationHandler;

    private static final BigDecimal DEFAULT_BASE_FARE = new BigDecimal("40.00");

    public Driver getOrCreateDriver(User user) {
        return driverRepository.findById(user.getId())
                .orElseGet(() -> {
                    Driver d = Driver.builder()
                            .user(user)
                            .vehicleType("BIKE")
                            .licensePlate("UK07AB1234")
                            .isOnline(false)
                            .status("OFFLINE")
                            .build();
                    return driverRepository.save(d);
                });
    }

    public DriverDashboardResponse getDriverDashboard(String emailOrPhone) {
        User user = userService.getUserEntity(emailOrPhone);
        Driver driver = getOrCreateDriver(user);

        BigDecimal totalEarnings = driverEarningsRepository.getTotalEarningsByDriverId(driver.getId());
        List<Delivery> allDeliveries = deliveryRepository.findByDriverIdOrderByAssignedAtDesc(driver.getId());
        
        long completedDeliveries = allDeliveries.stream()
                .filter(d -> "DELIVERED".equals(d.getStatus()))
                .count();

        List<DeliveryResponse> deliveryHistory = allDeliveries.stream()
                .map(this::mapToDeliveryResponse)
                .collect(Collectors.toList());

        DeliveryResponse activeDelivery = allDeliveries.stream()
                .filter(d -> "ASSIGNED".equals(d.getStatus()) || "PICKED_UP".equals(d.getStatus()))
                .findFirst()
                .map(this::mapToDeliveryResponse)
                .orElse(null);

        return DriverDashboardResponse.builder()
                .isOnline(driver.isOnline())
                .status(driver.getStatus())
                .totalEarnings(totalEarnings)
                .completedDeliveries(completedDeliveries)
                .deliveryHistory(deliveryHistory)
                .activeDelivery(activeDelivery)
                .build();
    }

    @Transactional
    public DriverDashboardResponse toggleOnlineStatus(String emailOrPhone) {
        User user = userService.getUserEntity(emailOrPhone);
        Driver driver = getOrCreateDriver(user);
        
        driver.setOnline(!driver.isOnline());
        if (driver.isOnline()) {
            driver.setStatus("AVAILABLE");
        } else {
            driver.setStatus("OFFLINE");
        }
        driverRepository.save(driver);
        return getDriverDashboard(emailOrPhone);
    }

    @Transactional
    public DriverDashboardResponse updateLocation(String emailOrPhone, Double lat, Double lng) {
        User user = userService.getUserEntity(emailOrPhone);
        Driver driver = getOrCreateDriver(user);
        
        driver.setCurrentLat(lat);
        driver.setCurrentLng(lng);
        driverRepository.save(driver);
        
        // Broadcast location updates to customer tracking order if there is an active delivery
        List<Delivery> activeDeliveries = deliveryRepository.findByDriverIdAndStatusOrderByAssignedAtDesc(driver.getId(), "ASSIGNED");
        if (activeDeliveries.isEmpty()) {
            activeDeliveries = deliveryRepository.findByDriverIdAndStatusOrderByAssignedAtDesc(driver.getId(), "PICKED_UP");
        }
        if (!activeDeliveries.isEmpty()) {
            Long orderId = activeDeliveries.get(0).getOrder().getId();
            locationHandler.broadcastLocation(orderId, lat, lng);
        }
        
        return getDriverDashboard(emailOrPhone);
    }

    public Page<OrderResponse> getAvailableOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findAvailableOrdersForDelivery(pageable).map(orderService::mapToResponse);
    }

    @Transactional
    public DeliveryResponse acceptOrder(String emailOrPhone, Long orderId) {
        User user = userService.getUserEntity(emailOrPhone);
        Driver driver = getOrCreateDriver(user);
        
        if (!driver.isOnline()) {
            throw new BadRequestException("Driver is offline. Toggle online status to accept orders.");
        }
        if ("ACTIVE_DELIVERY".equals(driver.getStatus())) {
            throw new BadRequestException("Driver already has an active delivery.");
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
                
        // Ensure no active delivery exists for this order
        if (deliveryRepository.findByOrderId(orderId).filter(d -> !"CANCELLED".equals(d.getStatus())).isPresent()) {
            throw new BadRequestException("Order is already assigned to another driver.");
        }

        Delivery delivery = Delivery.builder()
                .order(order)
                .driver(driver)
                .status("ASSIGNED")
                .assignedAt(LocalDateTime.now())
                .build();
                
        driver.setStatus("ACTIVE_DELIVERY");
        driverRepository.save(driver);
        
        Delivery saved = deliveryRepository.save(delivery);
        return mapToDeliveryResponse(saved);
    }

    @Transactional
    public DeliveryResponse updateDeliveryStatus(String emailOrPhone, Long deliveryId, String statusStr) {
        User user = userService.getUserEntity(emailOrPhone);
        Driver driver = getOrCreateDriver(user);
        
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", deliveryId));
                
        if (!delivery.getDriver().getId().equals(driver.getId())) {
            throw new BadRequestException("This delivery is assigned to a different driver.");
        }

        String status = statusStr.toUpperCase();
        Order order = delivery.getOrder();
        
        if ("PICKED_UP".equals(status)) {
            delivery.setStatus("PICKED_UP");
            delivery.setPickedUpAt(LocalDateTime.now());
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
            orderRepository.save(order);
        } else if ("DELIVERED".equals(status)) {
            delivery.setStatus("DELIVERED");
            delivery.setDeliveredAt(LocalDateTime.now());
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
            
            driver.setStatus("AVAILABLE");
            driverRepository.save(driver);
            
            // Calculate and record earnings
            DriverEarnings earnings = DriverEarnings.builder()
                    .driver(driver)
                    .delivery(delivery)
                    .baseFare(DEFAULT_BASE_FARE)
                    .tip(BigDecimal.ZERO)
                    .earnedAt(LocalDateTime.now())
                    .build();
            driverEarningsRepository.save(earnings);
        } else if ("CANCELLED".equals(status)) {
            delivery.setStatus("CANCELLED");
            order.setStatus(OrderStatus.PREPARING); // revert order status
            orderRepository.save(order);
            
            driver.setStatus("AVAILABLE");
            driverRepository.save(driver);
        } else {
            throw new BadRequestException("Invalid delivery status: " + statusStr);
        }

        Delivery saved = deliveryRepository.save(delivery);
        
        // Publish OrderStateChangeEvent here
        eventPublisher.publishEvent(new OrderStateChangeEvent(order));
        
        return mapToDeliveryResponse(saved);
    }

    public DeliveryResponse mapToDeliveryResponse(Delivery d) {
        return DeliveryResponse.builder()
                .id(d.getId())
                .orderId(d.getOrder().getId())
                .orderNumber(d.getOrder().getOrderNumber())
                .customerName(d.getOrder().getUser().getName())
                .customerPhone(d.getOrder().getUser().getPhone())
                .deliveryAddress(d.getOrder().getDeliveryAddress() != null ?
                        userService.mapToAddressResponse(d.getOrder().getDeliveryAddress()).getFullAddress() : "No Address")
                .status(d.getStatus())
                .assignedAt(d.getAssignedAt())
                .pickedUpAt(d.getPickedUpAt())
                .deliveredAt(d.getDeliveredAt())
                .proofOfDeliveryUrl(d.getProofOfDeliveryUrl())
                .build();
    }
}
