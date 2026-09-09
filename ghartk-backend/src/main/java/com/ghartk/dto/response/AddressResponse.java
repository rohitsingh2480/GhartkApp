package com.ghartk.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddressResponse {
    private Long id;
    private String label;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private Double lat;
    private Double lng;
    @JsonProperty("isDefault")
    private boolean isDefault;

    public AddressResponse() {}

    public AddressResponse(Long id, String label, String line1, String line2, String city, String state, String pincode, Double lat, Double lng, boolean isDefault) {
        this.id = id;
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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String label; private String line1; private String line2;
        private String city; private String state; private String pincode; private Double lat;
        private Double lng; private boolean isDefault;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder label(String label) { this.label = label; return this; }
        public Builder line1(String line1) { this.line1 = line1; return this; }
        public Builder line2(String line2) { this.line2 = line2; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder pincode(String pincode) { this.pincode = pincode; return this; }
        public Builder lat(Double lat) { this.lat = lat; return this; }
        public Builder lng(Double lng) { this.lng = lng; return this; }
        public Builder isDefault(boolean isDefault) { this.isDefault = isDefault; return this; }
        public AddressResponse build() {
            return new AddressResponse(id, label, line1, line2, city, state, pincode, lat, lng, isDefault);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder(line1 != null ? line1 : "");
        if (line2 != null && !line2.isEmpty()) sb.append(", ").append(line2);
        sb.append(", ").append(city).append(" - ").append(pincode).append(", ").append(state);
        return sb.toString();
    }
}
