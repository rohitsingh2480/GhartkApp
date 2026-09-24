package com.ghartk.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriverResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String vehicleType;
    private String licensePlate;
    private boolean isOnline;
    private String status;
    private Double currentLat;
    private Double currentLng;
    private BigDecimal totalEarnings;
    private long totalDeliveries;
    private boolean isActive;
    private LocalDateTime createdAt;

    public DriverResponse() {}

    public DriverResponse(Long id, String name, String email, String phone, String vehicleType, String licensePlate,
                          boolean isOnline, String status, Double currentLat, Double currentLng,
                          BigDecimal totalEarnings, long totalDeliveries, boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.vehicleType = vehicleType;
        this.licensePlate = licensePlate;
        this.isOnline = isOnline;
        this.status = status;
        this.currentLat = currentLat;
        this.currentLng = currentLng;
        this.totalEarnings = totalEarnings;
        this.totalDeliveries = totalDeliveries;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String name; private String email; private String phone;
        private String vehicleType; private String licensePlate; private boolean isOnline;
        private String status; private Double currentLat; private Double currentLng;
        private BigDecimal totalEarnings; private long totalDeliveries;
        private boolean isActive; private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder vehicleType(String vehicleType) { this.vehicleType = vehicleType; return this; }
        public Builder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }
        public Builder isOnline(boolean isOnline) { this.isOnline = isOnline; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder currentLat(Double currentLat) { this.currentLat = currentLat; return this; }
        public Builder currentLng(Double currentLng) { this.currentLng = currentLng; return this; }
        public Builder totalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; return this; }
        public Builder totalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DriverResponse build() {
            return new DriverResponse(id, name, email, phone, vehicleType, licensePlate, isOnline, status, currentLat, currentLng, totalEarnings, totalDeliveries, isActive, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean isOnline) { this.isOnline = isOnline; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public BigDecimal getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; }
    public long getTotalDeliveries() { return totalDeliveries; }
    public void setTotalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
