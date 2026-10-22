package com.muncho.backend.dto;

import com.muncho.backend.model.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String cuisine;
    private String address;
    private String phone;
    private String imageUrl;
    private String operatingHours;
    private boolean available;
    private Long ownerId;
    private String ownerName;
    private int dishesCount;
    private List<DishResponse> dishes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static RestaurantResponse fromEntity(Restaurant restaurant, List<DishResponse> dishes) {
        if (restaurant == null) return null;
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .cuisine(restaurant.getCuisine())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .imageUrl(restaurant.getImageUrl())
                .operatingHours(restaurant.getOperatingHours())
                .available(restaurant.isAvailable())
                .ownerId(restaurant.getOwner() != null ? restaurant.getOwner().getId() : null)
                .ownerName(restaurant.getOwner() != null ? restaurant.getOwner().getFullName() : null)
                .dishesCount(dishes != null ? dishes.size() : 0)
                .dishes(dishes)
                .createdAt(restaurant.getCreatedAt())
                .updatedAt(restaurant.getUpdatedAt())
                .build();
    }
}
