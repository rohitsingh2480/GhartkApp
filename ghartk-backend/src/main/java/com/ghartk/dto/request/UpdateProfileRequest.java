package com.ghartk.dto.request;


import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @Size(min = 2, max = 50) private String name;
    private String profileImage;
}
