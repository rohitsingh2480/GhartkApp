package com.ghartk.config;

import com.ghartk.entity.*;
import com.ghartk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        // Seed/Update Admin
        Optional<User> adminOpt = userRepository.findByEmail("admin@ghartk.com");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setVerified(true);
            userRepository.save(admin);
            log.info("Admin user password synced successfully!");
        } else {
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@ghartk.com")
                    .phone("9999999999")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user seeded successfully!");
        }

        // Seed/Update Customer
        Optional<User> customerOpt = userRepository.findByEmail("rahul@gmail.com");
        if (customerOpt.isPresent()) {
            User customer = customerOpt.get();
            customer.setPasswordHash(passwordEncoder.encode("Admin@123"));
            customer.setRole(Role.CUSTOMER);
            customer.setActive(true);
            customer.setVerified(true);
            userRepository.save(customer);
            log.info("Customer user password synced successfully!");
        } else {
            User customer = User.builder()
                    .name("Rahul Kumar")
                    .email("rahul@gmail.com")
                    .phone("9876543210")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(Role.CUSTOMER)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(customer);
            log.info("Customer user seeded successfully!");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) {
            log.info("Categories and products already exist. Skipping seeding.");
            return;
        }

        log.info("Seeding categories and products...");

        // 1. Fruits & Vegetables
        Category fruitsVeg = Category.builder()
                .name("Fruits & Vegetables")
                .description("Fresh fruits and vegetables sourced directly from local farms")
                .iconEmoji("🍎")
                .imageUrl("https://images.unsplash.com/photo-1610348725531-843dff14f9da?w=400")
                .isActive(true)
                .sortOrder(1)
                .build();
        fruitsVeg = categoryRepository.save(fruitsVeg);

        Product apple = Product.builder()
                .category(fruitsVeg)
                .name("Fresh Apple (Shimla)")
                .description("Sweet and crisp premium quality apples from Shimla")
                .price(new BigDecimal("120.00"))
                .mrp(new BigDecimal("150.00"))
                .stockQty(50)
                .unit("1 kg")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.5)
                .reviewCount(12)
                .imageUrl("https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400")
                .build();

        Product banana = Product.builder()
                .category(fruitsVeg)
                .name("Fresh Banana (Robusta)")
                .description("Naturally ripened Robusta bananas, rich in energy")
                .price(new BigDecimal("60.00"))
                .mrp(new BigDecimal("80.00"))
                .stockQty(100)
                .unit("1 dozen")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.2)
                .reviewCount(25)
                .imageUrl("https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400")
                .build();

        Product potato = Product.builder()
                .category(fruitsVeg)
                .name("Fresh Potato (Alu)")
                .description("Freshly harvested potatoes, perfect for daily cooking")
                .price(new BigDecimal("30.00"))
                .mrp(new BigDecimal("40.00"))
                .stockQty(200)
                .unit("1 kg")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.0)
                .reviewCount(45)
                .imageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400")
                .build();

        Product tomato = Product.builder()
                .category(fruitsVeg)
                .name("Fresh Tomato (Desi)")
                .description("Tangy and juicy local tomatoes, fresh from the farm")
                .price(new BigDecimal("45.00"))
                .mrp(new BigDecimal("60.00"))
                .stockQty(150)
                .unit("1 kg")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.1)
                .reviewCount(30)
                .imageUrl("https://images.unsplash.com/photo-1595855759920-86582396756a?w=400")
                .build();

        productRepository.saveAll(Arrays.asList(apple, banana, potato, tomato));

        // 2. Dairy & Eggs
        Category dairyEggs = Category.builder()
                .name("Dairy & Eggs")
                .description("Fresh milk, butter, cheese, paneer, and eggs")
                .iconEmoji("🥛")
                .imageUrl("https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=400")
                .isActive(true)
                .sortOrder(2)
                .build();
        dairyEggs = categoryRepository.save(dairyEggs);

        Product milk = Product.builder()
                .category(dairyEggs)
                .name("Toned Fresh Milk")
                .description("Pasteurised toned milk from local dairy cooperatives")
                .price(new BigDecimal("60.00"))
                .mrp(new BigDecimal("65.00"))
                .stockQty(80)
                .unit("1 L")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.6)
                .reviewCount(80)
                .imageUrl("https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400")
                .build();

        Product eggs = Product.builder()
                .category(dairyEggs)
                .name("Organic Brown Eggs")
                .description("Farm-fresh organic brown eggs, high in protein")
                .price(new BigDecimal("50.00"))
                .mrp(new BigDecimal("60.00"))
                .stockQty(60)
                .unit("6 pcs")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(false)
                .rating(4.4)
                .reviewCount(15)
                .imageUrl("https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400")
                .build();

        Product butter = Product.builder()
                .category(dairyEggs)
                .name("Amul Butter (Salted)")
                .description("The classic salted butter from Amul - Utterly Butterly Delicious")
                .price(new BigDecimal("56.00"))
                .mrp(new BigDecimal("58.00"))
                .stockQty(90)
                .unit("100 g")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.7)
                .reviewCount(95)
                .imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400")
                .build();

        productRepository.saveAll(Arrays.asList(milk, eggs, butter));

        // 3. Bakery & Bread
        Category bakeryBread = Category.builder()
                .name("Bakery & Bread")
                .description("Freshly baked breads, cookies, cakes, and buns")
                .iconEmoji("🍞")
                .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400")
                .isActive(true)
                .sortOrder(3)
                .build();
        bakeryBread = categoryRepository.save(bakeryBread);

        Product wheatBread = Product.builder()
                .category(bakeryBread)
                .name("Whole Wheat Bread")
                .description("Soft and healthy sliced brown whole wheat bread")
                .price(new BigDecimal("40.00"))
                .mrp(new BigDecimal("45.00"))
                .stockQty(40)
                .unit("1 pc")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.3)
                .reviewCount(18)
                .imageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400")
                .build();

        Product cookies = Product.builder()
                .category(bakeryBread)
                .name("Chocolate Chip Cookies")
                .description("Delicious bakery cookies loaded with real chocolate chips")
                .price(new BigDecimal("80.00"))
                .mrp(new BigDecimal("100.00"))
                .stockQty(35)
                .unit("1 pack")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.8)
                .reviewCount(42)
                .imageUrl("https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400")
                .build();

        productRepository.saveAll(Arrays.asList(wheatBread, cookies));

        // 4. Beverages
        Category beverages = Category.builder()
                .name("Beverages")
                .description("Juices, soft drinks, water, tea, and coffee")
                .iconEmoji("🍹")
                .imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400")
                .isActive(true)
                .sortOrder(4)
                .build();
        beverages = categoryRepository.save(beverages);

        Product juice = Product.builder()
                .category(beverages)
                .name("100% Orange Juice")
                .description("Pure, unsweetened orange juice rich in Vitamin C")
                .price(new BigDecimal("99.00"))
                .mrp(new BigDecimal("120.00"))
                .stockQty(50)
                .unit("1 L")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.2)
                .reviewCount(22)
                .imageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400")
                .build();

        Product cola = Product.builder()
                .category(beverages)
                .name("Coca-Cola Soft Drink")
                .description("The refreshing carbonated cola taste you love")
                .price(new BigDecimal("45.00"))
                .mrp(new BigDecimal("45.00"))
                .stockQty(120)
                .unit("750 ml")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.5)
                .reviewCount(110)
                .imageUrl("https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400")
                .build();

        productRepository.saveAll(Arrays.asList(juice, cola));

        // 5. Snacks & Munchies
        Category snacks = Category.builder()
                .name("Snacks & Munchies")
                .description("Chips, namkeen, dry fruits, chocolates, and sweets")
                .iconEmoji("🍪")
                .imageUrl("https://images.unsplash.com/photo-1599490659213-e2b9527b0f76?w=400")
                .isActive(true)
                .sortOrder(5)
                .build();
        snacks = categoryRepository.save(snacks);

        Product chips = Product.builder()
                .category(snacks)
                .name("Potato Chips (Classic Salted)")
                .description("Crispy and golden potato chips with perfect salt seasoning")
                .price(new BigDecimal("20.00"))
                .mrp(new BigDecimal("20.00"))
                .stockQty(300)
                .unit("1 pack")
                .isAvailable(true)
                .isFeatured(false)
                .isVeg(true)
                .rating(4.1)
                .reviewCount(55)
                .imageUrl("https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400")
                .build();

        Product almonds = Product.builder()
                .category(snacks)
                .name("Roasted Almonds (Badam)")
                .description("Crunchy and healthy dry roasted premium California almonds")
                .price(new BigDecimal("250.00"))
                .mrp(new BigDecimal("299.00"))
                .stockQty(40)
                .unit("200 g")
                .isAvailable(true)
                .isFeatured(true)
                .isVeg(true)
                .rating(4.6)
                .reviewCount(32)
                .imageUrl("https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400")
                .build();

        productRepository.saveAll(Arrays.asList(chips, almonds));

        log.info("Categories and products seeded successfully!");
    }
}
