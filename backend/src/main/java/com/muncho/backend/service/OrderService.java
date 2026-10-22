package com.muncho.backend.service;

import com.muncho.backend.dto.*;
import com.muncho.backend.exception.BadRequestException;
import com.muncho.backend.exception.DuplicateOrderException;
import com.muncho.backend.exception.ForbiddenException;
import com.muncho.backend.exception.ResourceNotFoundException;
import com.muncho.backend.model.*;
import com.muncho.backend.repository.DishRepository;
import com.muncho.backend.repository.OrderRepository;
import com.muncho.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final RestaurantService restaurantService;

    private static final BigDecimal DELIVERY_FEE = new BigDecimal("5.00");
    private static final BigDecimal TAX_RATE = new BigDecimal("0.05"); // 5% tax

    @Transactional(readOnly = true)
    public CheckoutPreviewResponse previewCheckout(CheckoutPreviewRequest request) {
        Restaurant restaurant = restaurantService.getRestaurantEntity(request.getRestaurantId());
        if (!restaurant.isAvailable()) {
            throw new BadRequestException("Restaurant '" + restaurant.getName() + "' is currently unavailable.");
        }

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Dish dish = dishRepository.findById(itemReq.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + itemReq.getDishId()));

            if (!dish.getRestaurant().getId().equals(restaurant.getId())) {
                throw new BadRequestException("Dish '" + dish.getName() + "' does not belong to restaurant '" + restaurant.getName() + "'.");
            }
            if (!dish.isAvailable()) {
                throw new BadRequestException("Dish '" + dish.getName() + "' is currently unavailable.");
            }

            BigDecimal itemSubtotal = dish.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            itemResponses.add(OrderItemResponse.builder()
                    .dishId(dish.getId())
                    .dishName(dish.getName())
                    .unitPrice(dish.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal.setScale(2, RoundingMode.HALF_UP))
                    .build());
        }

        BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(DELIVERY_FEE).add(tax).subtract(discount).setScale(2, RoundingMode.HALF_UP);

        return CheckoutPreviewResponse.builder()
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getName())
                .items(itemResponses)
                .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP))
                .deliveryFee(DELIVERY_FEE)
                .tax(tax)
                .discount(discount)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User customer) {
        Restaurant restaurant = restaurantService.getRestaurantEntity(request.getRestaurantId());
        if (!restaurant.isAvailable()) {
            throw new BadRequestException("Restaurant '" + restaurant.getName() + "' is currently unavailable.");
        }

        CheckoutPreviewRequest previewReq = CheckoutPreviewRequest.builder()
                .restaurantId(request.getRestaurantId())
                .items(request.getItems())
                .build();
        CheckoutPreviewResponse preview = previewCheckout(previewReq);

        // Prevent duplicate order submission within the last 30 seconds
        LocalDateTime thirtySecondsAgo = LocalDateTime.now().minusSeconds(30);
        boolean duplicate = orderRepository.existsByCustomerAndRestaurantAndTotalAmountAndCreatedAtAfter(
                customer, restaurant, preview.getTotalAmount(), thirtySecondsAgo
        );
        if (duplicate) {
            throw new DuplicateOrderException("A duplicate order was recently submitted. Please wait a moment.");
        }

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        PaymentStatus paymentStatus = (request.getPaymentMethod() == PaymentMethod.CASH)
                ? PaymentStatus.PENDING
                : PaymentStatus.PAID;

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customer(customer)
                .restaurant(restaurant)
                .status(OrderStatus.PLACED)
                .paymentStatus(paymentStatus)
                .paymentMethod(request.getPaymentMethod())
                .deliveryAddress(request.getDeliveryAddress().trim())
                .customerPhone(request.getCustomerPhone())
                .subtotal(preview.getSubtotal())
                .deliveryFee(preview.getDeliveryFee())
                .tax(preview.getTax())
                .discount(preview.getDiscount())
                .totalAmount(preview.getTotalAmount())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Dish dish = dishRepository.findById(itemReq.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found: " + itemReq.getDishId()));

            BigDecimal itemSubtotal = dish.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .dish(dish)
                    .dishName(dish.getName())
                    .unitPrice(dish.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        return OrderResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(User customer) {
        return orderRepository.findByCustomerOrderByCreatedAtDesc(customer).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getCustomerOrderById(Long orderId, User customer) {
        Order order = getOrderEntity(orderId);
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new ForbiddenException("You are not authorized to view this customer order.");
        }
        return OrderResponse.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRestaurantOrders(Long restaurantId, User owner) {
        Restaurant restaurant = restaurantService.getRestaurantEntity(restaurantId);
        restaurantService.verifyOwnership(restaurant, owner);

        return orderRepository.findByRestaurantOrderByCreatedAtDesc(restaurant).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getRestaurantOrderById(Long orderId, User owner) {
        Order order = getOrderEntity(orderId);
        restaurantService.verifyOwnership(order.getRestaurant(), owner);
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateRestaurantOrderStatus(Long orderId, OrderStatus newStatus, User owner) {
        Order order = getOrderEntity(orderId);
        restaurantService.verifyOwnership(order.getRestaurant(), owner);

        OrderStatus current = order.getStatus();

        // Valid transitions from restaurant
        if (current == OrderStatus.PLACED && (newStatus == OrderStatus.ACCEPTED || newStatus == OrderStatus.REJECTED)) {
            order.setStatus(newStatus);
            if (newStatus == OrderStatus.REJECTED && order.getPaymentStatus() == PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
            }
        } else if (current == OrderStatus.ACCEPTED && newStatus == OrderStatus.PREPARING) {
            order.setStatus(newStatus);
        } else if (current == OrderStatus.PREPARING && newStatus == OrderStatus.READY_FOR_PICKUP) {
            order.setStatus(newStatus);
        } else {
            throw new BadRequestException("Invalid status transition from '" + current + "' to '" + newStatus + "' for restaurant.");
        }

        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<UserDto> getEligibleDeliveryWorkers() {
        return userRepository.findByRoleAndAvailableTrue(Role.DELIVERY_WORKER).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse assignDeliveryWorker(Long orderId, Long workerId, User owner) {
        Order order = getOrderEntity(orderId);
        restaurantService.verifyOwnership(order.getRestaurant(), owner);

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.REJECTED) {
            throw new BadRequestException("Cannot assign delivery worker to order in terminal state: " + order.getStatus());
        }

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery worker not found with id: " + workerId));

        if (worker.getRole() != Role.DELIVERY_WORKER) {
            throw new BadRequestException("User " + worker.getEmail() + " is not a delivery worker.");
        }

        order.setDeliveryWorker(worker);
        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAssignedDeliveryOrders(User worker) {
        return orderRepository.findByDeliveryWorkerOrderByCreatedAtDesc(worker).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getDeliveryOrderById(Long orderId, User worker) {
        Order order = getOrderEntity(orderId);
        if (order.getDeliveryWorker() == null || !order.getDeliveryWorker().getId().equals(worker.getId())) {
            throw new ForbiddenException("This order is not assigned to you.");
        }
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateDeliveryStatus(Long orderId, OrderStatus newStatus, String failureReason, User worker) {
        Order order = getOrderEntity(orderId);
        if (order.getDeliveryWorker() == null || !order.getDeliveryWorker().getId().equals(worker.getId())) {
            throw new ForbiddenException("This order is not assigned to you.");
        }

        OrderStatus current = order.getStatus();

        if (current == OrderStatus.DELIVERED) {
            throw new BadRequestException("Completed orders cannot be updated further.");
        }
        if (current == OrderStatus.CANCELLED || current == OrderStatus.REJECTED) {
            throw new BadRequestException("Order is in terminal state: " + current);
        }

        if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
            if (current != OrderStatus.READY_FOR_PICKUP && current != OrderStatus.ACCEPTED && current != OrderStatus.PREPARING) {
                throw new BadRequestException("Cannot mark out for delivery from status: " + current);
            }
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        } else if (newStatus == OrderStatus.DELIVERED) {
            if (current != OrderStatus.OUT_FOR_DELIVERY) {
                throw new BadRequestException("Order must be 'OUT_FOR_DELIVERY' before marking as delivered.");
            }
            order.setStatus(OrderStatus.DELIVERED);
            if (order.getPaymentMethod() == PaymentMethod.CASH) {
                order.setPaymentStatus(PaymentStatus.PAID);
            }
        } else if (newStatus == OrderStatus.FAILED) {
            if (current != OrderStatus.OUT_FOR_DELIVERY) {
                throw new BadRequestException("Order must be 'OUT_FOR_DELIVERY' before marking as failed.");
            }
            if (!StringUtils.hasText(failureReason)) {
                throw new BadRequestException("A failure reason is required when marking an order as failed.");
            }
            order.setStatus(OrderStatus.FAILED);
            order.setFailureReason(failureReason.trim());
        } else {
            throw new BadRequestException("Unsupported delivery status transition to: " + newStatus);
        }

        return OrderResponse.fromEntity(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByIdAuthorized(Long orderId, User caller) {
        Order order = getOrderEntity(orderId);

        boolean isCustomer = order.getCustomer().getId().equals(caller.getId());
        boolean isOwner = order.getRestaurant().getOwner().getId().equals(caller.getId());
        boolean isAssignedWorker = order.getDeliveryWorker() != null && order.getDeliveryWorker().getId().equals(caller.getId());

        if (!isCustomer && !isOwner && !isAssignedWorker) {
            throw new ForbiddenException("You are not authorized to view this order.");
        }

        return OrderResponse.fromEntity(order);
    }

    public Order getOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
