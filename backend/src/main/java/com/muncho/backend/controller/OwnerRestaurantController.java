package com.muncho.backend.controller;

import com.muncho.backend.dto.RestaurantRequest;
import com.muncho.backend.dto.RestaurantResponse;
import com.muncho.backend.model.User;
import com.muncho.backend.service.AuthService;
import com.muncho.backend.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/restaurants")
@RequiredArgsConstructor
public class OwnerRestaurantController {

    private final RestaurantService restaurantService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(@Valid @RequestBody RestaurantRequest request) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.createRestaurant(request, owner));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getMyRestaurants() {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(restaurantService.getMyRestaurants(owner));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantDetails(@PathVariable Long id) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(restaurantService.getRestaurantForOwner(id, owner));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantResponse> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request
    ) {
        User owner = authService.getAuthenticatedUser();
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, request, owner));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<RestaurantResponse> updateAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        User owner = authService.getAuthenticatedUser();
        boolean available = body != null && Boolean.TRUE.equals(body.get("available"));
        return ResponseEntity.ok(restaurantService.updateAvailability(id, available, owner));
    }
}
