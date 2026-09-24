package com.ghartk.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OnboardDriverRequest {
    @NotBlank(message = "Driver name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String vehicleType = "BIKE"; // BIKE, SCOOTER, EV, CYCLE

    private String licensePlate;

    private String city = "New Delhi";

    public OnboardDriverRequest() {}

    public OnboardDriverRequest(String name, String email, String phone, String password, String vehicleType, String licensePlate, String city) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.vehicleType = vehicleType != null ? vehicleType : "BIKE";
        this.licensePlate = licensePlate;
        this.city = city != null ? city : "New Delhi";
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
