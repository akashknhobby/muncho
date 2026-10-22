package com.muncho.backend.controller;

import com.muncho.backend.dto.DishRequest;
import com.muncho.backend.dto.DishResponse;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.DishService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DishController {

    private final DishService dishService;
    private final AuthService authService;

    // Public / Customer Endpoints
    @GetMapping("/api/dishes")
    public ResponseEntity<List<DishResponse>> getAllDishes(
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(dishService.getAllDishes(search));
    }

    @GetMapping("/api/dishes/{id}")
    public ResponseEntity<DishResponse> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.getDishById(id));
    }

    @GetMapping("/api/restaurants/{restaurantId}/dishes")
    public ResponseEntity<List<DishResponse>> getDishesByRestaurant(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "true") boolean availableOnly
    ) {
        return ResponseEntity.ok(dishService.getDishesByRestaurant(restaurantId, availableOnly));
    }

    // Owner Menu Management Endpoints
    @PostMapping("/api/owner/restaurants/{restaurantId}/dishes")
    public ResponseEntity<DishResponse> addDish(
            @PathVariable Long restaurantId,
            @Valid @RequestBody DishRequest request
    ) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(dishService.addDish(restaurantId, request, owner));
    }

    @PutMapping("/api/owner/dishes/{dishId}")
    public ResponseEntity<DishResponse> updateDish(
            @PathVariable Long dishId,
            @Valid @RequestBody DishRequest request
    ) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(dishService.updateDish(dishId, request, owner));
    }

    @DeleteMapping("/api/owner/dishes/{dishId}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long dishId) {
        User owner = authService.getAuthenticatedUser();
        dishService.deleteDish(dishId, owner);
        return ResponseEntity.noContent().build();
    }
}
