package com.muncho.backend.dto;

import com.muncho.backend.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusUpdateRequest {

    @NotNull(message = "Order status is required (OUT_FOR_DELIVERY, DELIVERED, FAILED)")
    private OrderStatus status;

    private String failureReason;
}
