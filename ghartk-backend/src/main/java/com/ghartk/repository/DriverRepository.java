package com.ghartk.repository;


import com.ghartk.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByIsOnlineTrueAndStatus(String status);
}
