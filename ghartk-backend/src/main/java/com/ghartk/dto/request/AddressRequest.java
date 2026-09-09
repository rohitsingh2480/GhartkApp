package com.ghartk.dto.request;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AddressRequest {
    @NotBlank private String label;
    @NotBlank private String line1;
    private String line2;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid Indian pincode") private String pincode;
    private Double lat;
    private Double lng;
    @JsonProperty("isDefault")
    private boolean isDefault;

    public AddressRequest() {}

    public AddressRequest(String label, String line1, String line2, String city, String state, String pincode, Double lat, Double lng, boolean isDefault) {
        this.label = label;
        this.line1 = line1;
        this.line2 = line2;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.lat = lat;
        this.lng = lng;
        this.isDefault = isDefault;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }
    public String getLine2() { return line2; }
    public void setLine2(String line2) { this.line2 = line2; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }
}
