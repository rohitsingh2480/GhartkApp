package com.ghartk.repository;


import com.ghartk.entity.Role;
import com.ghartk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    long countByRole(Role role);
    Page<User> findByRole(Role role, Pageable pageable);
    @Query("SELECT u FROM User u WHERE u.role = 'CUSTOMER' AND (LOWER(u.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%',:q,'%')) OR u.phone LIKE CONCAT('%',:q,'%'))")
    Page<User> searchCustomers(@Param("q") String query, Pageable pageable);
}
