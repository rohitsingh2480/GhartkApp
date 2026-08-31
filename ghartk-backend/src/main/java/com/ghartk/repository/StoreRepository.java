package com.ghartk.repository;

import com.ghartk.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByMerchantUserId(Long merchantUserId);
    List<Store> findByPincodeAndIsActiveTrue(String pincode);
    List<Store> findByIsActiveTrue();
    boolean existsByName(String name);
}

