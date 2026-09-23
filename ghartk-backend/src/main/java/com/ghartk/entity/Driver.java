package com.ghartk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "is_online")
    private boolean isOnline = false;

    @Column(name = "current_lat")
    private Double currentLat;

    @Column(name = "current_lng")
    private Double currentLng;

    @Column(nullable = false)
    private String status = "AVAILABLE";

    public Driver() {}

    public Driver(Long id, User user, String vehicleType, String licensePlate, boolean isOnline, Double currentLat, Double currentLng, String status) {
        this.id = id;
        this.user = user;
        this.vehicleType = vehicleType;
        this.licensePlate = licensePlate;
        this.isOnline = isOnline;
        this.currentLat = currentLat;
        this.currentLng = currentLng;
        this.status = status != null ? status : "AVAILABLE";
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private User user; private String vehicleType; private String licensePlate;
        private boolean isOnline = false; private Double currentLat; private Double currentLng;
        private String status = "AVAILABLE";

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder vehicleType(String vehicleType) { this.vehicleType = vehicleType; return this; }
        public Builder licensePlate(String licensePlate) { this.licensePlate = licensePlate; return this; }
        public Builder isOnline(boolean isOnline) { this.isOnline = isOnline; return this; }
        public Builder currentLat(Double currentLat) { this.currentLat = currentLat; return this; }
        public Builder currentLng(Double currentLng) { this.currentLng = currentLng; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Driver build() {
            return new Driver(id, user, vehicleType, licensePlate, isOnline, currentLat, currentLng, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean isOnline) { this.isOnline = isOnline; }
    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
