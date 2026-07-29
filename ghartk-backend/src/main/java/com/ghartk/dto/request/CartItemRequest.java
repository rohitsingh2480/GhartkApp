package com.ghartk.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull private Long productId;
    @NotNull @Min(0) private Integer quantity;
}
