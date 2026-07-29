package com.ghartk.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DriverDashboardResponse {
    private boolean isOnline;
    private String status;
    private BigDecimal totalEarnings;
    private long completedDeliveries;
    private List<DeliveryResponse> deliveryHistory;
    private DeliveryResponse activeDelivery;
}
