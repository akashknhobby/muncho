package com.muncho.backend.repository;

import com.muncho.backend.model.Dish;
import com.muncho.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByRestaurant(Restaurant restaurant);
    List<Dish> findByRestaurantAndAvailableTrue(Restaurant restaurant);
    List<Dish> findByAvailableTrue();
    List<Dish> findByNameContainingIgnoreCaseAndAvailableTrue(String name);
}
