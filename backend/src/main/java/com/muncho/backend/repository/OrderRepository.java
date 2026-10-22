package com.muncho.backend.repository;

import com.muncho.backend.model.Order;
import com.muncho.backend.model.Restaurant;
import com.muncho.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Order> findByRestaurantOrderByCreatedAtDesc(Restaurant restaurant);
    List<Order> findByDeliveryWorkerOrderByCreatedAtDesc(User deliveryWorker);
    Optional<Order> findByOrderNumber(String orderNumber);
    boolean existsByCustomerAndRestaurantAndTotalAmountAndCreatedAtAfter(
            User customer,
            Restaurant restaurant,
            BigDecimal totalAmount,
            LocalDateTime after
    );
}
