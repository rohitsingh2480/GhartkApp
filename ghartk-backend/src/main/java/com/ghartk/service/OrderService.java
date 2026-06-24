package com.ghartk.service;

import com.ghartk.dto.request.OrderRequest;
import com.ghartk.dto.response.*;
import com.ghartk.entity.*;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final CartService cartService;
    private final UserService userService;
    private final PaymentRepository paymentRepository;

    private static final BigDecimal DELIVERY_FEE = new BigDecimal("49.00");
    private static final BigDecimal FREE_DELIVERY_THRESHOLD = new BigDecimal("499.00");
    private static final BigDecimal PACKAGING_FEE = new BigDecimal("10.00");

    @Transactional
    public OrderResponse placeOrder(String emailOrPhone, OrderRequest request) {
        User user = userService.getUserEntity(emailOrPhone);
        Cart cart = cartService.getCartEntity(emailOrPhone);
        if (cart.getItems().isEmpty()) throw new BadRequestException("Cart is empty");
        Address address = addressRepository.findById(request.getAddressId())
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Address", request.getAddressId()));
        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getPriceSnapshot().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal deliveryFee = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0 ? BigDecimal.ZERO : DELIVERY_FEE;
        BigDecimal total = subtotal.add(deliveryFee).add(PACKAGING_FEE);
        String orderNumber = "ORD" + System.currentTimeMillis();
        Order order = Order.builder()
                .orderNumber(orderNumber).user(user).deliveryAddress(address)
                .status(OrderStatus.PLACED).paymentMethod(request.getPaymentMethod())
                .subtotal(subtotal).deliveryFee(deliveryFee).packagingFee(PACKAGING_FEE)
                .discount(BigDecimal.ZERO).total(total).notes(request.getNotes())
                .estimatedDelivery("30-45 mins").build();
        List<OrderItem> orderItems = cart.getItems().stream().map(ci -> {
            BigDecimal itemTotal = ci.getPriceSnapshot().multiply(BigDecimal.valueOf(ci.getQuantity()));
            return OrderItem.builder().order(order).product(ci.getProduct())
                    .productName(ci.getProduct().getName()).productImage(ci.getProduct().getImageUrl())
                    .quantity(ci.getQuantity()).unitPrice(ci.getPriceSnapshot()).totalPrice(itemTotal).build();
        }).collect(Collectors.toList());
        order.setItems(orderItems);
        Payment payment = Payment.builder().order(order).method(request.getPaymentMethod())
                .status(PaymentStatus.PENDING).amount(total).build();
        order.setPayment(payment);
        Order saved = orderRepository.save(order);
        cartService.clearCart(emailOrPhone);
        return mapToResponse(saved);
    }

    public Page<OrderResponse> getMyOrders(String emailOrPhone, int page, int size) {
        User user = userService.getUserEntity(emailOrPhone);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).map(this::mapToResponse);
    }

    public OrderResponse getMyOrder(String emailOrPhone, Long orderId) {
        User user = userService.getUserEntity(emailOrPhone);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return mapToResponse(order);
    }

    public OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(item ->
                OrderItemResponse.builder().id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName()).productImage(item.getProductImage())
                        .quantity(item.getQuantity()).unitPrice(item.getUnitPrice()).totalPrice(item.getTotalPrice())
                        .build()).collect(Collectors.toList());
        return OrderResponse.builder()
                .id(order.getId()).orderNumber(order.getOrderNumber()).status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(order.getDeliveryAddress() != null ?
                        userService.mapToAddressResponse(order.getDeliveryAddress()) : null)
                .items(items).subtotal(order.getSubtotal()).deliveryFee(order.getDeliveryFee())
                .packagingFee(order.getPackagingFee()).discount(order.getDiscount()).total(order.getTotal())
                .notes(order.getNotes()).estimatedDelivery(order.getEstimatedDelivery())
                .createdAt(order.getCreatedAt()).updatedAt(order.getUpdatedAt())
                .customerName(order.getUser().getName()).customerPhone(order.getUser().getPhone())
                .build();
    }
}
