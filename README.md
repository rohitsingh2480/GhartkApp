# GHARTK — Hyperlocal Delivery Platform

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

---

## ⚡ Start in 3 Steps

### Step 1: Setup MySQL Database
MySQL will auto-create the database. Just ensure MySQL is running with:
- **Host:** localhost:3306
- **User:** root
- **Password:** root

> To change DB password, edit: `ghartk-backend/src/main/resources/application.properties`

### Step 2: Start Backend (Spring Boot)
```bash
cd ghartk-backend
mvn spring-boot:run
```
Backend runs at: **http://localhost:8080/api**

### Step 3: Start Frontend (React)
```bash
cd ghartk-frontend
npm run dev
```
Frontend runs at: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@ghartk.com       | Admin@123 |
| Customer | rahul@gmail.com        | Admin@123 |
| Customer | priya@gmail.com        | Admin@123 |
| Customer | amit@gmail.com         | Admin@123 |

---

## 📱 App Features

### Customer App (http://localhost:3000)
- 🏠 Home page with hero banner, categories, featured products
- 🔍 Product search with filters (category, price, rating)
- 🛒 Cart with real-time quantity management
- ✅ Checkout with address management
- 📦 Order tracking with live status stepper
- 👤 Profile management
- 🌙 Dark mode support

### Admin Panel (http://localhost:3000/admin)
- 📊 Dashboard with KPIs (revenue, orders, users)
- 📦 Order management with status updates
- 🛒 Product CRUD with stock management
- 🏷️ Category management
- 👥 Customer management

---

## 🗃️ Tech Stack

### Backend
- Spring Boot 3.2 + Java 17
- Spring Security + JWT
- JPA/Hibernate + MySQL
- Lombok + Validation

### Frontend
- React 18 + Vite
- React Router DOM v6
- Zustand (state management)
- TanStack Query (data fetching)
- React Hot Toast (notifications)
- Custom CSS Design System

---

## 📁 Project Structure
```
GhartkApp/
├── ghartk-backend/          # Spring Boot API
│   └── src/main/java/com/ghartk/
│       ├── entity/          # JPA entities
│       ├── repository/      # Spring Data repos
│       ├── service/         # Business logic
│       ├── controller/      # REST endpoints
│       ├── security/        # JWT auth
│       ├── dto/             # Request/Response DTOs
│       └── exception/       # Error handling
│
└── ghartk-frontend/         # React app
    └── src/
        ├── api/             # Axios + endpoints
        ├── store/           # Zustand stores
        ├── styles/          # CSS design system
        ├── components/      # Shared components
        ├── pages/           # App pages
        └── utils/           # Helpers
```

---

## 🌐 API Endpoints

| Module   | Endpoint             | Auth     |
|----------|----------------------|----------|
| Auth     | POST /auth/register  | Public   |
| Auth     | POST /auth/login     | Public   |
| Products | GET /products        | Public   |
| Cart     | GET/POST /cart       | Customer |
| Orders   | GET/POST /orders     | Customer |
| Admin    | GET /admin/dashboard | Admin    |


