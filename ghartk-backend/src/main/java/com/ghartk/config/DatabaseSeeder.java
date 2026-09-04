package com.ghartk.config;

import com.ghartk.entity.*;
import com.ghartk.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, CategoryRepository categoryRepository,
                          ProductRepository productRepository, StoreRepository storeRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCategoriesAndProducts();
        seedHauzKhasStore();
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

    private void seedHauzKhasStore() {
        // Skip if already seeded
        if (userRepository.findByEmail("hauzkhas@ghartk.com").isPresent()) {
            log.info("Hauz Khas store already seeded. Skipping.");
            return;
        }

        log.info("Seeding Hauz Khas (110049) vendor, store, and products...");

        // 1. Create Merchant User for Hauz Khas
        User merchant = User.builder()
                .name("Priya Sharma")
                .email("hauzkhas@ghartk.com")
                .phone("9811234567")
                .passwordHash(passwordEncoder.encode("Vendor@123"))
                .role(Role.MERCHANT)
                .isActive(true)
                .isVerified(true)
                .build();
        merchant = userRepository.save(merchant);

        // 2. Create Hauz Khas Store
        Store store = Store.builder()
                .merchantUserId(merchant.getId())
                .name("Hauz Khas Fresh Market")
                .description("Premium organic groceries and gourmet essentials in Hauz Khas Village, South Delhi")
                .addressLine1("Shop 7, Hauz Khas Village Market")
                .city("New Delhi")
                .pincode("110049")
                .isActive(true)
                .build();
        store = storeRepository.save(store);
        Long storeId = store.getId();

        // Get categories (they should already be seeded)
        List<Category> categories = categoryRepository.findAll();
        Category fruitsVeg = categories.stream().filter(c -> c.getName().contains("Fruits")).findFirst().orElse(categories.get(0));
        Category dairy = categories.stream().filter(c -> c.getName().contains("Dairy")).findFirst().orElse(categories.get(0));
        Category staples = categories.stream().filter(c -> c.getName().contains("Staples") || c.getName().contains("Atta")).findFirst().orElse(categories.get(0));
        Category beverages = categories.stream().filter(c -> c.getName().contains("Beverages")).findFirst().orElse(categories.get(0));
        Category snacks = categories.stream().filter(c -> c.getName().contains("Snacks")).findFirst().orElse(categories.get(0));

        // 3. Create 15+ Products for Hauz Khas store
        productRepository.saveAll(Arrays.asList(
            Product.builder().storeId(storeId).category(fruitsVeg)
                .name("Organic Avocado (Imported)").description("Creamy Hass avocados, perfect for salads and toast")
                .price(new BigDecimal("180.00")).mrp(new BigDecimal("220.00")).stockQty(30).unit("2 pcs")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.7).reviewCount(45)
                .imageUrl("https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400").build(),

            Product.builder().storeId(storeId).category(fruitsVeg)
                .name("Baby Spinach (Palak)").description("Fresh organic baby spinach leaves, locally sourced from Gurgaon farms")
                .price(new BigDecimal("60.00")).mrp(new BigDecimal("75.00")).stockQty(80).unit("200 g")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.4).reviewCount(28)
                .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400").build(),

            Product.builder().storeId(storeId).category(fruitsVeg)
                .name("Cherry Tomatoes").description("Sweet vine-ripened cherry tomatoes from controlled farms")
                .price(new BigDecimal("90.00")).mrp(new BigDecimal("110.00")).stockQty(60).unit("250 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.3).reviewCount(19)
                .imageUrl("https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400").build(),

            Product.builder().storeId(storeId).category(fruitsVeg)
                .name("Kiwi (New Zealand)").description("Tangy and juicy imported kiwi fruits rich in Vitamin C")
                .price(new BigDecimal("140.00")).mrp(new BigDecimal("165.00")).stockQty(40).unit("3 pcs")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.5).reviewCount(33)
                .imageUrl("https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400").build(),

            Product.builder().storeId(storeId).category(dairy)
                .name("Amul Gold Full Cream Milk").description("Rich and creamy full-cream toned milk for daily needs")
                .price(new BigDecimal("68.00")).mrp(new BigDecimal("68.00")).stockQty(200).unit("1 litre")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.6).reviewCount(120)
                .imageUrl("https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400").build(),

            Product.builder().storeId(storeId).category(dairy)
                .name("Greek Yogurt (Plain)").description("Thick and protein-rich Greek-style yogurt, no sugar added")
                .price(new BigDecimal("120.00")).mrp(new BigDecimal("145.00")).stockQty(45).unit("400 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.4).reviewCount(38)
                .imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400").build(),

            Product.builder().storeId(storeId).category(dairy)
                .name("Amul Butter (Salted)").description("Classic salted butter for paranthas and cooking")
                .price(new BigDecimal("56.00")).mrp(new BigDecimal("58.00")).stockQty(100).unit("100 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.8).reviewCount(89)
                .imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400").build(),

            Product.builder().storeId(storeId).category(staples)
                .name("Organic Quinoa").description("Gluten-free superfood grain, perfect for healthy meals")
                .price(new BigDecimal("320.00")).mrp(new BigDecimal("399.00")).stockQty(35).unit("500 g")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.6).reviewCount(22)
                .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400").build(),

            Product.builder().storeId(storeId).category(staples)
                .name("Basmati Rice (Aged)").description("Premium aged long-grain Basmati rice for biryani and pulao")
                .price(new BigDecimal("210.00")).mrp(new BigDecimal("250.00")).stockQty(60).unit("1 kg")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.7).reviewCount(56)
                .imageUrl("https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400").build(),

            Product.builder().storeId(storeId).category(staples)
                .name("Extra Virgin Olive Oil").description("Cold-pressed imported olive oil for salads and cooking")
                .price(new BigDecimal("550.00")).mrp(new BigDecimal("650.00")).stockQty(25).unit("500 ml")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.5).reviewCount(41)
                .imageUrl("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400").build(),

            Product.builder().storeId(storeId).category(beverages)
                .name("Cold Brew Coffee").description("Ready-to-drink smooth cold brew coffee, no sugar")
                .price(new BigDecimal("150.00")).mrp(new BigDecimal("180.00")).stockQty(50).unit("250 ml")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.3).reviewCount(67)
                .imageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400").build(),

            Product.builder().storeId(storeId).category(beverages)
                .name("Green Tea (Matcha)").description("Premium Japanese matcha green tea powder")
                .price(new BigDecimal("280.00")).mrp(new BigDecimal("350.00")).stockQty(30).unit("100 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.4).reviewCount(29)
                .imageUrl("https://images.unsplash.com/photo-1556881286-fc6915169721?w=400").build(),

            Product.builder().storeId(storeId).category(beverages)
                .name("Fresh Orange Juice").description("100% pure cold-pressed orange juice, no preservatives")
                .price(new BigDecimal("90.00")).mrp(new BigDecimal("110.00")).stockQty(40).unit("500 ml")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.2).reviewCount(34)
                .imageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400").build(),

            Product.builder().storeId(storeId).category(snacks)
                .name("Trail Mix (Nuts & Berries)").description("Healthy mix of almonds, cashews, cranberries and raisins")
                .price(new BigDecimal("350.00")).mrp(new BigDecimal("420.00")).stockQty(40).unit("300 g")
                .isAvailable(true).isFeatured(true).isVeg(true).rating(4.6).reviewCount(52)
                .imageUrl("https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400").build(),

            Product.builder().storeId(storeId).category(snacks)
                .name("Dark Chocolate 72% Cocoa").description("Premium Belgian dark chocolate bar, rich and intense")
                .price(new BigDecimal("180.00")).mrp(new BigDecimal("220.00")).stockQty(55).unit("100 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.5).reviewCount(44)
                .imageUrl("https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400").build(),

            Product.builder().storeId(storeId).category(snacks)
                .name("Hummus (Classic)").description("Creamy chickpea hummus with tahini and olive oil")
                .price(new BigDecimal("160.00")).mrp(new BigDecimal("195.00")).stockQty(35).unit("200 g")
                .isAvailable(true).isFeatured(false).isVeg(true).rating(4.3).reviewCount(27)
                .imageUrl("https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400").build()
        ));

        log.info("Hauz Khas (110049) store seeded: Merchant=Priya Sharma, Store=Hauz Khas Fresh Market, Products=16");
    }
}
