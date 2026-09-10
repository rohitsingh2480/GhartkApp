package com.ghartk.dto.response;

import java.math.BigDecimal;
import java.util.List;

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

    public MerchantAnalyticsResponse() {}

    public MerchantAnalyticsResponse(long totalOrders, long todaysOrders, BigDecimal totalRevenue, BigDecimal todaysRevenue, long pendingOrders, long preparingOrders, long completedOrders, long totalProducts, long lowStockCount, List<OrderResponse> activeOrders) {
        this.totalOrders = totalOrders;
        this.todaysOrders = todaysOrders;
        this.totalRevenue = totalRevenue;
        this.todaysRevenue = todaysRevenue;
        this.pendingOrders = pendingOrders;
        this.preparingOrders = preparingOrders;
        this.completedOrders = completedOrders;
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
        this.activeOrders = activeOrders;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalOrders; private long todaysOrders; private BigDecimal totalRevenue;
        private BigDecimal todaysRevenue; private long pendingOrders; private long preparingOrders;
        private long completedOrders; private long totalProducts; private long lowStockCount;
        private List<OrderResponse> activeOrders;

        public Builder totalOrders(long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder todaysOrders(long todaysOrders) { this.todaysOrders = todaysOrders; return this; }
        public Builder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public Builder todaysRevenue(BigDecimal todaysRevenue) { this.todaysRevenue = todaysRevenue; return this; }
        public Builder pendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; return this; }
        public Builder preparingOrders(long preparingOrders) { this.preparingOrders = preparingOrders; return this; }
        public Builder completedOrders(long completedOrders) { this.completedOrders = completedOrders; return this; }
        public Builder totalProducts(long totalProducts) { this.totalProducts = totalProducts; return this; }
        public Builder lowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; return this; }
        public Builder activeOrders(List<OrderResponse> activeOrders) { this.activeOrders = activeOrders; return this; }
        public MerchantAnalyticsResponse build() {
            return new MerchantAnalyticsResponse(totalOrders, todaysOrders, totalRevenue, todaysRevenue, pendingOrders, preparingOrders, completedOrders, totalProducts, lowStockCount, activeOrders);
        }
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getTodaysOrders() { return todaysOrders; }
    public void setTodaysOrders(long todaysOrders) { this.todaysOrders = todaysOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public BigDecimal getTodaysRevenue() { return todaysRevenue; }
    public void setTodaysRevenue(BigDecimal todaysRevenue) { this.todaysRevenue = todaysRevenue; }
    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
    public long getPreparingOrders() { return preparingOrders; }
    public void setPreparingOrders(long preparingOrders) { this.preparingOrders = preparingOrders; }
    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
    public List<OrderResponse> getActiveOrders() { return activeOrders; }
    public void setActiveOrders(List<OrderResponse> activeOrders) { this.activeOrders = activeOrders; }
}
