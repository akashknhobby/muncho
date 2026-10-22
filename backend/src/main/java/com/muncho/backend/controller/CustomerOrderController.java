package com.muncho.backend.controller;

import com.muncho.backend.dto.CheckoutPreviewRequest;
import com.muncho.backend.dto.CheckoutPreviewResponse;
import com.muncho.backend.dto.CreateOrderRequest;
import com.muncho.backend.dto.OrderResponse;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping("/checkout/preview")
    public ResponseEntity<CheckoutPreviewResponse> previewCheckout(@Valid @RequestBody CheckoutPreviewRequest request) {
        return ResponseEntity.ok(orderService.previewCheckout(request));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        User customer = authService.getAuthenticatedUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request, customer));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        User customer = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getCustomerOrders(customer));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        User customer = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getCustomerOrderById(id, customer));
    }
}
