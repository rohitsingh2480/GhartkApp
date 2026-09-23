package com.ghartk.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@EntityListeners(AuditingEntityListener.class)
public class Delivery {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(nullable = false)
    private String status = "ASSIGNED";

    @CreatedDate
    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "proof_of_delivery_url")
    private String proofOfDeliveryUrl;

    public Delivery() {}

    public Delivery(Long id, Order order, Driver driver, String status, LocalDateTime assignedAt, LocalDateTime pickedUpAt, LocalDateTime deliveredAt, String proofOfDeliveryUrl) {
        this.id = id;
        this.order = order;
        this.driver = driver;
        this.status = status != null ? status : "ASSIGNED";
        this.assignedAt = assignedAt;
        this.pickedUpAt = pickedUpAt;
        this.deliveredAt = deliveredAt;
        this.proofOfDeliveryUrl = proofOfDeliveryUrl;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Order order; private Driver driver; private String status = "ASSIGNED";
        private LocalDateTime assignedAt; private LocalDateTime pickedUpAt; private LocalDateTime deliveredAt;
        private String proofOfDeliveryUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder order(Order order) { this.order = order; return this; }
        public Builder driver(Driver driver) { this.driver = driver; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public Builder pickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; return this; }
        public Builder deliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; return this; }
        public Builder proofOfDeliveryUrl(String proofOfDeliveryUrl) { this.proofOfDeliveryUrl = proofOfDeliveryUrl; return this; }
        public Delivery build() {
            return new Delivery(id, order, driver, status, assignedAt, pickedUpAt, deliveredAt, proofOfDeliveryUrl);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public String getProofOfDeliveryUrl() { return proofOfDeliveryUrl; }
    public void setProofOfDeliveryUrl(String proofOfDeliveryUrl) { this.proofOfDeliveryUrl = proofOfDeliveryUrl; }
}
