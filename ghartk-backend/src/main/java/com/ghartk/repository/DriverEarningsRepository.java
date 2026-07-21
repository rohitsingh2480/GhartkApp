package com.ghartk.repository;

import com.ghartk.entity.DriverEarnings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DriverEarningsRepository extends JpaRepository<DriverEarnings, Long> {
    List<DriverEarnings> findByDriverIdOrderByEarnedAtDesc(Long driverId);
    
    @Query("SELECT COALESCE(SUM(de.baseFare + de.tip), 0) FROM DriverEarnings de WHERE de.driver.id = :driverId")
    BigDecimal getTotalEarningsByDriverId(@Param("driverId") Long driverId);
}
