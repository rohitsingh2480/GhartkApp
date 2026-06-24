package com.ghartk.dto.request;

import com.ghartk.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull private Long addressId;
    @NotNull private PaymentMethod paymentMethod;
    private String notes;
    private String couponCode;
}
