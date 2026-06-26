package com.ghartk.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private long totalUsers;
    private long totalOrders;
    private long todaysOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todaysRevenue;
    private long pendingOrders;
    private long deliveredOrders;
    private long totalProducts;
    private long lowStockCount;
    private List<OrderResponse> recentOrders;
}
