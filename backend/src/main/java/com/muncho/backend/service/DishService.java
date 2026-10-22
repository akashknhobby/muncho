package com.muncho.backend.service;

import com.muncho.backend.dto.DishRequest;
import com.muncho.backend.dto.DishResponse;
import com.muncho.backend.exception.ResourceNotFoundException;
import com.muncho.backend.model.Dish;
import com.muncho.backend.model.Restaurant;
import com.muncho.backend.model.User;
import com.muncho.backend.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository dishRepository;
    private final RestaurantService restaurantService;

    @Transactional(readOnly = true)
    public List<DishResponse> getAllDishes(String search) {
        List<Dish> list;
        if (StringUtils.hasText(search)) {
            list = dishRepository.findByNameContainingIgnoreCaseAndAvailableTrue(search.trim());
        } else {
            list = dishRepository.findByAvailableTrue();
        }
        return list.stream().map(DishResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DishResponse getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));
        return DishResponse.fromEntity(dish);
    }

    @Transactional(readOnly = true)
    public List<DishResponse> getDishesByRestaurant(Long restaurantId, boolean onlyAvailable) {
        Restaurant restaurant = restaurantService.getRestaurantEntity(restaurantId);
        List<Dish> dishes = onlyAvailable
                ? dishRepository.findByRestaurantAndAvailableTrue(restaurant)
                : dishRepository.findByRestaurant(restaurant);
        return dishes.stream().map(DishResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public DishResponse addDish(Long restaurantId, DishRequest request, User owner) {
        Restaurant restaurant = restaurantService.getRestaurantEntity(restaurantId);
        restaurantService.verifyOwnership(restaurant, owner);

        Dish dish = Dish.builder()
                .restaurant(restaurant)
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .available(request.isAvailable())
                .preparationTimeMinutes(request.getPreparationTimeMinutes())
                .build();

        return DishResponse.fromEntity(dishRepository.save(dish));
    }

    @Transactional
    public DishResponse updateDish(Long dishId, DishRequest request, User owner) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + dishId));
        restaurantService.verifyOwnership(dish.getRestaurant(), owner);

        dish.setName(request.getName().trim());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setImageUrl(request.getImageUrl());
        dish.setCategory(request.getCategory());
        dish.setAvailable(request.isAvailable());
        dish.setPreparationTimeMinutes(request.getPreparationTimeMinutes());

        return DishResponse.fromEntity(dishRepository.save(dish));
    }

    @Transactional
    public void deleteDish(Long dishId, User owner) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + dishId));
        restaurantService.verifyOwnership(dish.getRestaurant(), owner);

        dishRepository.delete(dish);
    }

    public Dish getDishEntity(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));
    }
}
