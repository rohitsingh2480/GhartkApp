package com.ghartk.repository;

import com.ghartk.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsFeaturedTrueAndIsAvailableTrue();

    @Query("SELECT p FROM Product p WHERE p.isAvailable = true " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Product> findWithFilters(@Param("categoryId") Long categoryId,
                                   @Param("q") String query, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN Store s ON p.storeId = s.id WHERE p.isAvailable = true AND s.isActive = true " +
           "AND (:pincode IS NULL OR s.pincode = :pincode) " +
           "AND (:storeId IS NULL OR p.storeId = :storeId) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Product> findCustomerProducts(@Param("pincode") String pincode,
                                       @Param("storeId") Long storeId,
                                       @Param("categoryId") Long categoryId,
                                       @Param("q") String query,
                                       Pageable pageable);

    List<Product> findByStockQtyLessThanAndIsAvailableTrue(Integer threshold);
    long countByIsAvailableTrue();

    // ── Merchant / Store-scoped queries ──────────────────────────────────────

    @Query("SELECT p FROM Product p WHERE " +
           "(:storeId IS NULL OR p.storeId = :storeId) " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')))")
    Page<Product> findByStoreIdWithFilters(@Param("storeId") Long storeId,
                                           @Param("categoryId") Long categoryId,
                                           @Param("q") String query,
                                           Pageable pageable);
}

