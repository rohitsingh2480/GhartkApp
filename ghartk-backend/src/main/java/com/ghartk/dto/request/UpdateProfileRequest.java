package com.ghartk.dto.request;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    @Size(min = 2, max = 50) private String name;
    private String profileImage;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String name, String profileImage) {
        this.name = name;
        this.profileImage = profileImage;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
