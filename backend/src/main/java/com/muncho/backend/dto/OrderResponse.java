package com.muncho.backend.dto;

import com.muncho.backend.model.Order;
import com.muncho.backend.model.OrderStatus;
import com.muncho.backend.model.PaymentMethod;
import com.muncho.backend.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private Long deliveryWorkerId;
    private String deliveryWorkerName;
    private String deliveryWorkerPhone;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String deliveryAddress;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String failureReason;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse fromEntity(Order order) {
        if (order == null) return null;
        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(OrderItemResponse::fromEntity).collect(Collectors.toList())
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getFullName() : null)
                .customerPhone(order.getCustomerPhone() != null ? order.getCustomerPhone() : (order.getCustomer() != null ? order.getCustomer().getPhone() : null))
                .restaurantId(order.getRestaurant() != null ? order.getRestaurant().getId() : null)
                .restaurantName(order.getRestaurant() != null ? order.getRestaurant().getName() : null)
                .restaurantAddress(order.getRestaurant() != null ? order.getRestaurant().getAddress() : null)
                .deliveryWorkerId(order.getDeliveryWorker() != null ? order.getDeliveryWorker().getId() : null)
                .deliveryWorkerName(order.getDeliveryWorker() != null ? order.getDeliveryWorker().getFullName() : null)
                .deliveryWorkerPhone(order.getDeliveryWorker() != null ? order.getDeliveryWorker().getPhone() : null)
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(order.getDeliveryAddress())
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .tax(order.getTax())
                .discount(order.getDiscount())
                .totalAmount(order.getTotalAmount())
                .failureReason(order.getFailureReason())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
