package com.ghartk.repository;

import com.ghartk.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByDriverIdOrderByAssignedAtDesc(Long driverId);
    List<Delivery> findByDriverIdAndStatusOrderByAssignedAtDesc(Long driverId, String status);
}
