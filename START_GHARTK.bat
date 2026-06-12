@echo off
echo ============================================
echo   GHARTK - Starting Development Servers
echo ============================================

echo.
echo [1] Make sure MySQL is running with:
echo     Database: ghartk_db
echo     Username: root
echo     Password: root
echo.
echo [2] Opening Frontend at http://localhost:3000
echo [3] Backend API at http://localhost:8080/api
echo.

start "GHARTK Frontend" cmd /k "cd /d %~dp0ghartk-frontend && npm run dev"

echo.
echo ============================================
echo  ADMIN CREDENTIALS:
echo    Email:    admin@ghartk.com
echo    Password: Admin@123
echo.
echo  CUSTOMER CREDENTIALS:
echo    Email:    rahul@gmail.com
echo    Password: Admin@123
echo ============================================
echo.
echo To start backend, open a NEW terminal and run:
echo   cd ghartk-backend
echo   mvn spring-boot:run
echo.
pause
