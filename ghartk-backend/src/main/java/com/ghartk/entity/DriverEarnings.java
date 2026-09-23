package com.ghartk.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_earnings")
@EntityListeners(AuditingEntityListener.class)
public class DriverEarnings {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    @Column(name = "base_fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseFare;

    @Column(precision = 10, scale = 2)
    private BigDecimal tip = BigDecimal.ZERO;

    @CreatedDate
    @Column(name = "earned_at", updatable = false)
    private LocalDateTime earnedAt;

    public DriverEarnings() {}

    public DriverEarnings(Long id, Driver driver, Delivery delivery, BigDecimal baseFare, BigDecimal tip, LocalDateTime earnedAt) {
        this.id = id;
        this.driver = driver;
        this.delivery = delivery;
        this.baseFare = baseFare;
        this.tip = tip != null ? tip : BigDecimal.ZERO;
        this.earnedAt = earnedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Driver driver; private Delivery delivery;
        private BigDecimal baseFare; private BigDecimal tip = BigDecimal.ZERO;
        private LocalDateTime earnedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder driver(Driver driver) { this.driver = driver; return this; }
        public Builder delivery(Delivery delivery) { this.delivery = delivery; return this; }
        public Builder baseFare(BigDecimal baseFare) { this.baseFare = baseFare; return this; }
        public Builder tip(BigDecimal tip) { this.tip = tip; return this; }
        public Builder earnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; return this; }
        public DriverEarnings build() {
            return new DriverEarnings(id, driver, delivery, baseFare, tip, earnedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
    public Delivery getDelivery() { return delivery; }
    public void setDelivery(Delivery delivery) { this.delivery = delivery; }
    public BigDecimal getBaseFare() { return baseFare; }
    public void setBaseFare(BigDecimal baseFare) { this.baseFare = baseFare; }
    public BigDecimal getTip() { return tip; }
    public void setTip(BigDecimal tip) { this.tip = tip; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}
