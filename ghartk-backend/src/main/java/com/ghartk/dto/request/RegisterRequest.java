package com.ghartk.dto.request;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50) private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email") private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number") private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters") private String password;

    private String pincode;
    private String city;
    private String addressLine;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String phone, String password, String pincode, String city, String addressLine) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.pincode = pincode;
        this.city = city;
        this.addressLine = addressLine;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
}
