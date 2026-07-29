package com.ghartk.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MerchantAnalyticsResponse {
    private long totalOrders;
    private long todaysOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todaysRevenue;
    private long pendingOrders;
    private long preparingOrders;
    private long completedOrders;
    private long totalProducts;
    private long lowStockCount;
    private List<OrderResponse> activeOrders;
}
