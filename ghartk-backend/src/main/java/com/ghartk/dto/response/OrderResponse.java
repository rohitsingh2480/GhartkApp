package com.ghartk.dto.response;

import com.ghartk.entity.OrderStatus;
import com.ghartk.entity.PaymentMethod;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private AddressResponse deliveryAddress;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal packagingFee;
    private BigDecimal discount;
    private BigDecimal total;
    private String notes;
    private String estimatedDelivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String customerName;
    private String customerPhone;
}
