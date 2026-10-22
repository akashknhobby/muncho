package com.muncho.backend.controller;

import com.muncho.backend.dto.DeliveryStatusUpdateRequest;
import com.muncho.backend.dto.OrderResponse;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final OrderService orderService;
    private final AuthService authService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getMyDeliveries() {
        User worker = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getAssignedDeliveryOrders(worker));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getDeliveryOrderDetails(@PathVariable Long orderId) {
        User worker = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getDeliveryOrderById(orderId, worker));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateDeliveryStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody DeliveryStatusUpdateRequest request
    ) {
        User worker = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.updateDeliveryStatus(orderId, request.getStatus(), request.getFailureReason(), worker));
    }
}
