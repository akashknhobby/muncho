package com.muncho.backend.dto;

import com.muncho.backend.model.Dish;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishResponse {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private boolean available;
    private Integer preparationTimeMinutes;
    private LocalDateTime createdAt;

    public static DishResponse fromEntity(Dish dish) {
        if (dish == null) return null;
        return DishResponse.builder()
                .id(dish.getId())
                .restaurantId(dish.getRestaurant() != null ? dish.getRestaurant().getId() : null)
                .restaurantName(dish.getRestaurant() != null ? dish.getRestaurant().getName() : null)
                .name(dish.getName())
                .description(dish.getDescription())
                .price(dish.getPrice())
                .imageUrl(dish.getImageUrl())
                .category(dish.getCategory())
                .available(dish.isAvailable())
                .preparationTimeMinutes(dish.getPreparationTimeMinutes())
                .createdAt(dish.getCreatedAt())
                .build();
    }
}
