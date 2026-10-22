package com.muncho.backend.controller;

import com.muncho.backend.dto.OrderResponse;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class SharedOrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        User caller = authService.getAuthenticatedUser();
        return ResponseEntity.ok(orderService.getOrderByIdAuthorized(id, caller));
    }
}
