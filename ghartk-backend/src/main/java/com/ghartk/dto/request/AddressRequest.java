package com.ghartk.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank private String label;
    @NotBlank private String line1;
    private String line2;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid Indian pincode") private String pincode;
    private Double lat;
    private Double lng;
    @com.fasterxml.jackson.annotation.JsonProperty("isDefault")
    private boolean isDefault;
}
