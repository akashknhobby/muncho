package com.muncho.backend.service;

import com.muncho.backend.dto.DishResponse;
import com.muncho.backend.dto.RestaurantRequest;
import com.muncho.backend.dto.RestaurantResponse;
import com.muncho.backend.exception.ForbiddenException;
import com.muncho.backend.exception.ResourceNotFoundException;
import com.muncho.backend.model.Dish;
import com.muncho.backend.model.Restaurant;
import com.muncho.backend.model.User;
import com.muncho.backend.repository.DishRepository;
import com.muncho.backend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllAvailableRestaurants(String search) {
        List<Restaurant> list;
        if (StringUtils.hasText(search)) {
            list = restaurantRepository.findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(search.trim(), search.trim())
                    .stream().filter(Restaurant::isAvailable).collect(Collectors.toList());
        } else {
            list = restaurantRepository.findByAvailableTrue();
        }

        return list.stream()
                .map(r -> {
                    List<DishResponse> dishes = dishRepository.findByRestaurantAndAvailableTrue(r).stream()
                            .map(DishResponse::fromEntity).collect(Collectors.toList());
                    return RestaurantResponse.fromEntity(r, dishes);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));

        List<DishResponse> dishes = dishRepository.findByRestaurant(restaurant).stream()
                .map(DishResponse::fromEntity)
                .collect(Collectors.toList());

        return RestaurantResponse.fromEntity(restaurant, dishes);
    }

    @Transactional
    public RestaurantResponse createRestaurant(RestaurantRequest request, User owner) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .cuisine(request.getCuisine().trim())
                .address(request.getAddress().trim())
                .phone(request.getPhone())
                .imageUrl(request.getImageUrl())
                .operatingHours(request.getOperatingHours())
                .available(request.isAvailable())
                .owner(owner)
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return RestaurantResponse.fromEntity(saved, List.of());
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getMyRestaurants(User owner) {
        return restaurantRepository.findByOwner(owner).stream()
                .map(r -> {
                    List<DishResponse> dishes = dishRepository.findByRestaurant(r).stream()
                            .map(DishResponse::fromEntity).collect(Collectors.toList());
                    return RestaurantResponse.fromEntity(r, dishes);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantForOwner(Long id, User owner) {
        Restaurant restaurant = getRestaurantEntity(id);
        verifyOwnership(restaurant, owner);

        List<DishResponse> dishes = dishRepository.findByRestaurant(restaurant).stream()
                .map(DishResponse::fromEntity).collect(Collectors.toList());

        return RestaurantResponse.fromEntity(restaurant, dishes);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request, User owner) {
        Restaurant restaurant = getRestaurantEntity(id);
        verifyOwnership(restaurant, owner);

        restaurant.setName(request.getName().trim());
        restaurant.setDescription(request.getDescription());
        restaurant.setCuisine(request.getCuisine().trim());
        restaurant.setAddress(request.getAddress().trim());
        restaurant.setPhone(request.getPhone());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setOperatingHours(request.getOperatingHours());
        restaurant.setAvailable(request.isAvailable());

        Restaurant updated = restaurantRepository.save(restaurant);
        List<DishResponse> dishes = dishRepository.findByRestaurant(updated).stream()
                .map(DishResponse::fromEntity).collect(Collectors.toList());

        return RestaurantResponse.fromEntity(updated, dishes);
    }

    @Transactional
    public RestaurantResponse updateAvailability(Long id, boolean available, User owner) {
        Restaurant restaurant = getRestaurantEntity(id);
        verifyOwnership(restaurant, owner);

        restaurant.setAvailable(available);
        Restaurant updated = restaurantRepository.save(restaurant);

        List<DishResponse> dishes = dishRepository.findByRestaurant(updated).stream()
                .map(DishResponse::fromEntity).collect(Collectors.toList());

        return RestaurantResponse.fromEntity(updated, dishes);
    }

    public Restaurant getRestaurantEntity(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    public void verifyOwnership(Restaurant restaurant, User owner) {
        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new ForbiddenException("You are not authorized to manage this restaurant.");
        }
    }
}
