package com.muncho.backend.config;

import com.muncho.backend.model.Dish;
import com.muncho.backend.model.Restaurant;
import com.muncho.backend.model.Role;
import com.muncho.backend.model.User;
import com.muncho.backend.repository.DishRepository;
import com.muncho.backend.repository.RestaurantRepository;
import com.muncho.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data creation.");
            return;
        }

        log.info("Seeding initial users, restaurants, and dishes...");

        // 1. Users
        User customer = User.builder()
                .email("customer@muncho.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Alice Customer")
                .phone("+1-555-0101")
                .role(Role.CUSTOMER)
                .available(true)
                .build();

        User owner = User.builder()
                .email("owner@muncho.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Bob Owner")
                .phone("+1-555-0102")
                .role(Role.RESTAURANT_OWNER)
                .available(true)
                .build();

        User driver1 = User.builder()
                .email("driver@muncho.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Charlie Driver")
                .phone("+1-555-0103")
                .role(Role.DELIVERY_WORKER)
                .available(true)
                .build();

        User driver2 = User.builder()
                .email("driver2@muncho.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Diana Courier")
                .phone("+1-555-0104")
                .role(Role.DELIVERY_WORKER)
                .available(true)
                .build();

        userRepository.saveAll(List.of(customer, owner, driver1, driver2));

        // 2. Restaurants
        Restaurant burgerHub = Restaurant.builder()
                .name("Muncho Burger Hub")
                .description("Juicy handcrafted gourmet burgers and crispy fries.")
                .cuisine("American / Fast Food")
                .address("123 Food Street, Metro City")
                .phone("+1-555-BURG")
                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd")
                .operatingHours("10:00 AM - 11:00 PM")
                .available(true)
                .owner(owner)
                .build();

        Restaurant pizzaBella = Restaurant.builder()
                .name("Bella Trattoria")
                .description("Wood-fired authentic artisanal pizzas and homemade pasta.")
                .cuisine("Italian")
                .address("456 Olive Avenue, Metro City")
                .phone("+1-555-PIZZ")
                .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591")
                .operatingHours("11:00 AM - 10:00 PM")
                .available(true)
                .owner(owner)
                .build();

        restaurantRepository.saveAll(List.of(burgerHub, pizzaBella));

        // 3. Dishes
        Dish burger1 = Dish.builder()
                .restaurant(burgerHub)
                .name("Classic Smash Cheeseburger")
                .description("Double smashed beef patty with aged cheddar, pickles, and house sauce.")
                .price(new BigDecimal("9.99"))
                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd")
                .category("Burgers")
                .available(true)
                .preparationTimeMinutes(15)
                .build();

        Dish burger2 = Dish.builder()
                .restaurant(burgerHub)
                .name("Crispy BBQ Chicken Burger")
                .description("Fried buttermilk chicken breast coated with smoky BBQ glaze and slaw.")
                .price(new BigDecimal("10.99"))
                .imageUrl("https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b")
                .category("Burgers")
                .available(true)
                .preparationTimeMinutes(15)
                .build();

        Dish fries = Dish.builder()
                .restaurant(burgerHub)
                .name("Truffle Parmesan Fries")
                .description("Golden shoestring fries tossed in white truffle oil and grated parmesan.")
                .price(new BigDecimal("4.99"))
                .imageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877")
                .category("Sides")
                .available(true)
                .preparationTimeMinutes(8)
                .build();

        Dish shake = Dish.builder()
                .restaurant(burgerHub)
                .name("Salted Caramel Shake")
                .description("Thick handcrafted milkshake with Maldon sea salt caramel (currently sold out).")
                .price(new BigDecimal("5.49"))
                .imageUrl("https://images.unsplash.com/photo-1572490122747-3968b75cc699")
                .category("Drinks")
                .available(false) // unavailable test dish
                .preparationTimeMinutes(5)
                .build();

        Dish pizza1 = Dish.builder()
                .restaurant(pizzaBella)
                .name("Margherita DOC")
                .description("San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, extra virgin olive oil.")
                .price(new BigDecimal("12.99"))
                .imageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002")
                .category("Pizza")
                .available(true)
                .preparationTimeMinutes(20)
                .build();

        Dish pasta = Dish.builder()
                .restaurant(pizzaBella)
                .name("Fettuccine Alfredo")
                .description("Fresh egg pasta ribbons in a rich, velvety parmesan butter cream sauce.")
                .price(new BigDecimal("14.50"))
                .imageUrl("https://images.unsplash.com/photo-1645112411341-6c4fd023714a")
                .category("Pasta")
                .available(true)
                .preparationTimeMinutes(18)
                .build();

        dishRepository.saveAll(List.of(burger1, burger2, fries, shake, pizza1, pasta));

        log.info("Seed data successfully inserted!");
    }
}
