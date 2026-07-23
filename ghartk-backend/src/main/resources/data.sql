-- ============================================================
-- GHARTK SEED DATA - Indian Products, Users & Categories
-- All passwords = Admin@123 (BCrypt encoded)
-- ============================================================


-- Users (Admin + Customers)
INSERT IGNORE INTO users (name, email, phone, password_hash, role, is_active, is_verified, created_at, updated_at) VALUES
('Admin GHARTK', 'admin@ghartk.com', '9000000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'ADMIN', true, true, NOW(), NOW()),
('Rahul Sharma', 'rahul@gmail.com', '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'CUSTOMER', true, true, NOW(), NOW()),
('Priya Patel', 'priya@gmail.com', '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'CUSTOMER', true, true, NOW(), NOW()),
('Amit Kumar', 'amit@gmail.com', '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'CUSTOMER', true, true, NOW(), NOW()),
('Sneha Singh', 'sneha@gmail.com', '9876543213', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'CUSTOMER', true, true, NOW(), NOW()),
('Vikram Nair', 'vikram@gmail.com', '9876543214', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnLSX.knLa2', 'CUSTOMER', true, true, NOW(), NOW());

-- Addresses
INSERT IGNORE INTO addresses (user_id, label, line1, line2, city, state, pincode, lat, lng, is_default) VALUES
(2, 'Home', '42, Shivaji Nagar', 'Near Central Park', 'Mumbai', 'Maharashtra', '400001', 19.0760, 72.8777, true),
(2, 'Work', 'BKC, Bandra Kurla Complex', 'Office No. 501, 5th Floor', 'Mumbai', 'Maharashtra', '400051', 19.0596, 72.8654, false),
(3, 'Home', '15, Koregaon Park', 'Lane 5, Near Starbucks', 'Pune', 'Maharashtra', '411001', 18.5362, 73.8941, true),
(4, 'Home', '8, Connaught Place', 'Near Palika Bazaar', 'New Delhi', 'Delhi', '110001', 28.6315, 77.2167, true),
(5, 'Home', '22, Indiranagar', '100 Feet Road', 'Bengaluru', 'Karnataka', '560008', 12.9716, 77.5946, true);

-- Categories
INSERT IGNORE INTO categories (name, description, image_url, icon_emoji, is_active, sort_order) VALUES
('Food', 'Delicious meals from local restaurants', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200', '🍔', true, 1),
('Grocery', 'Fresh groceries delivered to your door', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200', '🛒', true, 2),
('Beverages', 'Cold drinks, juices, tea and coffee', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200', '🥤', true, 3),
('Snacks', 'Munchies and light bites', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200', '🍿', true, 4),
('Dairy & Eggs', 'Fresh dairy products and eggs', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200', '🥛', true, 5),
('Bakery', 'Fresh breads, cakes and pastries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', '🥐', true, 6),
('Fruits & Vegetables', 'Farm fresh seasonal produce', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200', '🥦', true, 7),
('Medicines', 'OTC medicines and health essentials', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200', '💊', true, 8);

-- Food Products (Category 1)
INSERT IGNORE INTO products (category_id, name, description, image_url, price, mrp, stock_qty, unit, is_available, is_featured, is_veg, rating, review_count, created_at, updated_at) VALUES
(1, 'Butter Chicken', 'Rich and creamy tomato-based chicken curry with aromatic spices, served with naan', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', 249.00, 299.00, 50, 'plate', true, true, false, 4.5, 342, NOW(), NOW()),
(1, 'Paneer Tikka Masala', 'Grilled paneer cubes in spiced tomato-cashew gravy, best paired with butter naan', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 199.00, 249.00, 45, 'plate', true, true, true, 4.4, 289, NOW(), NOW()),
(1, 'Veg Biryani', 'Aromatic basmati rice with mixed vegetables, whole spices and caramelized onions', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 179.00, 199.00, 60, 'plate', true, false, true, 4.2, 198, NOW(), NOW()),
(1, 'Chicken Biryani', 'Dum-cooked basmati rice with tender chicken pieces marinated in biryani masala', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 249.00, 279.00, 55, 'plate', true, true, false, 4.6, 512, NOW(), NOW()),
(1, 'Masala Dosa', 'Crispy rice crepe with spiced potato filling, served with coconut chutney and sambar', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', 99.00, 120.00, 40, 'plate', true, false, true, 4.3, 156, NOW(), NOW()),
(1, 'Dal Makhani', 'Slow-cooked black lentils simmered overnight in rich creamy tomato sauce', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', 149.00, 179.00, 35, 'bowl', true, false, true, 4.1, 124, NOW(), NOW()),
(1, 'Chole Bhature', 'Spicy chickpea curry served with fluffy deep-fried bread, a North Indian classic', 'https://images.unsplash.com/photo-1613987549117-eea77c5e0c06?w=400', 129.00, 149.00, 30, 'plate', true, false, true, 4.0, 89, NOW(), NOW()),

-- Grocery Products (Category 2)
(2, 'Aashirvaad Atta', 'Premium whole wheat flour for soft rotis, made from selected whole wheat grains', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', 289.00, 320.00, 100, '5kg', true, true, true, 4.5, 234, NOW(), NOW()),
(2, 'Fortune Sunflower Oil', 'Light and healthy refined sunflower cooking oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 165.00, 185.00, 80, '1 Litre', true, false, true, 4.2, 167, NOW(), NOW()),
(2, 'Tata Tea Gold', 'Premium blend of Assam and Darjeeling tea leaves for a robust cup', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 149.00, 165.00, 120, '250g', true, true, true, 4.4, 312, NOW(), NOW()),
(2, 'Maggi 2-Minute Noodles', 'The original masala flavour instant noodles, ready in just 2 minutes', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', 14.00, 15.00, 300, '70g', true, false, true, 4.1, 445, NOW(), NOW()),
(2, 'Tata Salt', 'Vacuum evaporated iodized salt for everyday cooking', 'https://images.unsplash.com/photo-1588315929518-7b20a78ed0f0?w=400', 24.00, 28.00, 200, '1kg', true, false, true, 4.0, 89, NOW(), NOW()),
(2, 'MDH Chana Masala', 'Authentic North Indian spice blend for chana, rajma and other dishes', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 45.00, 52.00, 150, '100g', true, false, true, 4.3, 178, NOW(), NOW()),

-- Beverages (Category 3)
(3, 'Coca-Cola', 'Refreshing classic cola drink, served chilled', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 40.00, 45.00, 150, '750ml', true, false, true, 4.3, 201, NOW(), NOW()),
(3, 'Real Orange Juice', 'Fresh squeezed orange juice with no added sugar or preservatives', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', 65.00, 75.00, 80, '1 Litre', true, true, true, 4.4, 178, NOW(), NOW()),
(3, 'Amul Lassi Rose', 'Sweet and creamy rose flavoured lassi made with fresh dahi', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 30.00, 35.00, 60, '200ml', true, false, true, 4.2, 134, NOW(), NOW()),
(3, 'Bisleri Water', 'Pure and safe packaged drinking water, tested and sealed', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 20.00, 22.00, 300, '1 Litre', true, false, true, 4.0, 89, NOW(), NOW()),

-- Snacks (Category 4)
(4, 'Haldiram Bhujia', 'Classic Bikaner-style sev bhujia, crispy and spicy', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', 30.00, 35.00, 150, '150g', true, true, true, 4.3, 234, NOW(), NOW()),
(4, 'Lay''s Classic Salted', 'Crunchy potato chips lightly salted, the perfect snack', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 20.00, 22.00, 200, '26g', true, false, true, 4.1, 289, NOW(), NOW()),
(4, 'Kurkure Masala Munch', 'Spicy crunchy corn puffs in tangy masala flavour', 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400', 20.00, 22.00, 180, '90g', true, false, true, 4.0, 167, NOW(), NOW()),

-- Dairy & Eggs (Category 5)
(5, 'Amul Gold Full Cream Milk', 'Full cream standardised milk rich in calcium and vitamins', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 31.00, 33.00, 100, '500ml', true, true, true, 4.5, 345, NOW(), NOW()),
(5, 'Amul Butter', 'Pasteurised table butter made from fresh cream, no added colour', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 56.00, 60.00, 80, '100g', true, false, true, 4.4, 234, NOW(), NOW()),
(5, 'Mother Dairy Paneer', 'Fresh soft cottage cheese made from pasteurised buffalo milk', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 89.00, 99.00, 60, '200g', true, true, true, 4.3, 189, NOW(), NOW()),
(5, 'Farm Fresh Eggs', 'Free-range farm fresh eggs, rich in protein', 'https://images.unsplash.com/photo-1569288063643-5d29ad54df68?w=400', 79.00, 90.00, 120, '12 pcs', true, false, false, 4.2, 156, NOW(), NOW()),

-- Bakery (Category 6)
(6, 'Modern Sandwich Bread', 'Soft sandwich bread enriched with vitamins and minerals', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 45.00, 50.00, 80, '400g', true, false, true, 4.1, 156, NOW(), NOW()),
(6, 'Britannia Fruit Cake', 'Classic fruit cake with raisins, cashews and cherries', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 65.00, 75.00, 50, '250g', true, true, true, 4.2, 178, NOW(), NOW()),

-- Fruits & Vegetables (Category 7)
(7, 'Fresh Tomatoes', 'Farm fresh red ripe tomatoes, perfect for curries and salads', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', 49.00, 60.00, 200, '500g', true, false, true, 4.0, 123, NOW(), NOW()),
(7, 'Banana Bunch', 'Fresh yellow bananas rich in potassium and natural energy', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 39.00, 45.00, 150, '6 pcs', true, true, true, 4.1, 234, NOW(), NOW()),
(7, 'Red Onions', 'Fresh Indian red onions, essential for all Indian cooking', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 35.00, 42.00, 300, '500g', true, false, true, 3.9, 89, NOW(), NOW()),
(7, 'Fresh Spinach', 'Tender fresh spinach leaves, rich in iron and vitamins', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 29.00, 35.00, 100, '250g', true, false, true, 4.0, 67, NOW(), NOW()),

-- Medicines (Category 8)
(8, 'Dolo 650', 'Paracetamol IP 650mg tablets for relief from fever and pain', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 29.00, 32.00, 100, '15 tabs', true, false, true, 4.6, 567, NOW(), NOW()),
(8, 'Disprin Classic', 'Aspirin 350mg effervescent tablets for headache and fever', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 19.00, 22.00, 80, '10 tabs', true, false, true, 4.2, 234, NOW(), NOW()),
(8, 'Volini Spray', 'Diclofenac diethylamine pain relief spray for muscle and joint pain', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 185.00, 210.00, 40, '60g', true, false, true, 4.4, 189, NOW(), NOW());
