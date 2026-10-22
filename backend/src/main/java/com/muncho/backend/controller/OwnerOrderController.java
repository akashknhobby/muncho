package com.muncho.backend.controller;

import com.muncho.backend.dto.AssignDeliveryRequest;
import com.muncho.backend.dto.OrderResponse;
import com.muncho.backend.dto.OrderStatusUpdateRequest;
import com.muncho.backend.dto.UserDto;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerOrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @GetMapping("/restaurants/{restaurantId}/orders")
    public ResponseEntity<List<OrderResponse>> getRestaurantOrders(@PathVariable Long restaurantId) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId, owner));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getRestaurantOrderById(orderId, owner));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.updateRestaurantOrderStatus(orderId, request.getStatus(), owner));
    }

    @GetMapping("/delivery-workers/eligible")
    public ResponseEntity<List<UserDto>> getEligibleDeliveryWorkers() {
        return ResponseEntity.ok(orderService.getEligibleDeliveryWorkers());
    }

    @PostMapping("/orders/{orderId}/assign-delivery")
    public ResponseEntity<OrderResponse> assignDeliveryWorker(
            @PathVariable Long orderId,
            @Valid @RequestBody AssignDeliveryRequest request
    ) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.assignDeliveryWorker(orderId, request.getDeliveryWorkerId(), owner));
    }
}
