package com.ghartk.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
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
    @com.fasterxml.jackson.annotation.JsonProperty("isDefault")
    private boolean isDefault;

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder(line1);
        if (line2 != null && !line2.isEmpty()) sb.append(", ").append(line2);
        sb.append(", ").append(city).append(" - ").append(pincode).append(", ").append(state);
        return sb.toString();
    }
}
