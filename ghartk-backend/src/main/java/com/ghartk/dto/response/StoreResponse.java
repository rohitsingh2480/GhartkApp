package com.ghartk.dto.response;

import java.time.LocalDateTime;

public class StoreResponse {
    private Long id;
    private Long merchantUserId;
    private String merchantName;
    private String merchantEmail;
    private String merchantPhone;
    private String name;
    private String description;
    private String logoUrl;
    private String addressLine1;
    private String city;
    private String pincode;
    private boolean isActive;
    private LocalDateTime createdAt;

    public StoreResponse() {}

    public StoreResponse(Long id, Long merchantUserId, String merchantName, String merchantEmail, String merchantPhone, String name, String description, String logoUrl, String addressLine1, String city, String pincode, boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.merchantUserId = merchantUserId;
        this.merchantName = merchantName;
        this.merchantEmail = merchantEmail;
        this.merchantPhone = merchantPhone;
        this.name = name;
        this.description = description;
        this.logoUrl = logoUrl;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.pincode = pincode;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long merchantUserId; private String merchantName; private String merchantEmail;
        private String merchantPhone; private String name; private String description; private String logoUrl;
        private String addressLine1; private String city; private String pincode; private boolean isActive;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder merchantUserId(Long merchantUserId) { this.merchantUserId = merchantUserId; return this; }
        public Builder merchantName(String merchantName) { this.merchantName = merchantName; return this; }
        public Builder merchantEmail(String merchantEmail) { this.merchantEmail = merchantEmail; return this; }
        public Builder merchantPhone(String merchantPhone) { this.merchantPhone = merchantPhone; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public Builder addressLine1(String addressLine1) { this.addressLine1 = addressLine1; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder pincode(String pincode) { this.pincode = pincode; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StoreResponse build() {
            return new StoreResponse(id, merchantUserId, merchantName, merchantEmail, merchantPhone, name, description, logoUrl, addressLine1, city, pincode, isActive, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMerchantUserId() { return merchantUserId; }
    public void setMerchantUserId(Long merchantUserId) { this.merchantUserId = merchantUserId; }
    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }
    public String getMerchantEmail() { return merchantEmail; }
    public void setMerchantEmail(String merchantEmail) { this.merchantEmail = merchantEmail; }
    public String getMerchantPhone() { return merchantPhone; }
    public void setMerchantPhone(String merchantPhone) { this.merchantPhone = merchantPhone; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
