package com.muncho.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.muncho.backend.dto.*;
import com.muncho.backend.model.OrderStatus;
import com.muncho.backend.model.PaymentMethod;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MunchoEndToEndTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString());
        return root.get("token").asText();
    }

    @Test
    @Order(1)
    void e2e01_customerLoginSuccessAndFailure() throws Exception {
        String token = loginAndGetToken("customer@muncho.com", "password123");
        assertNotNull(token);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer@muncho.com"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));

        LoginRequest invalid = new LoginRequest("customer@muncho.com", "wrongpass");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void e2e02_browseRestaurants() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/restaurants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();

        JsonNode restaurants = objectMapper.readTree(result.getResponse().getContentAsString());
        assertTrue(restaurants.size() >= 2);

        Long restaurantId = restaurants.get(0).get("id").asLong();

        mockMvc.perform(get("/api/restaurants/" + restaurantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(restaurantId))
                .andExpect(jsonPath("$.dishes").isArray());
    }

    @Test
    @Order(3)
    void e2e03_browseDishes() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/dishes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();

        JsonNode dishes = objectMapper.readTree(result.getResponse().getContentAsString());
        assertTrue(dishes.size() >= 1);

        Long dishId = dishes.get(0).get("id").asLong();

        mockMvc.perform(get("/api/dishes/" + dishId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(dishId))
                .andExpect(jsonPath("$.price").isNumber());
    }

    @Test
    @Order(4)
    void e2e04_checkoutPreviewAndOrderingFlow() throws Exception {
        String customerToken = loginAndGetToken("customer@muncho.com", "password123");
        String ownerToken = loginAndGetToken("owner@muncho.com", "password123");
        String driverToken = loginAndGetToken("driver@muncho.com", "password123");

        // 1. Preview Checkout
        CheckoutPreviewRequest previewReq = CheckoutPreviewRequest.builder()
                .restaurantId(1L)
                .items(List.of(
                        new OrderItemRequest(1L, 2),
                        new OrderItemRequest(3L, 1)
                ))
                .build();

        mockMvc.perform(post("/api/customer/checkout/preview")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(previewReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subtotal").value(24.97))
                .andExpect(jsonPath("$.deliveryFee").value(5.00))
                .andExpect(jsonPath("$.totalAmount").value(31.22));

        // 2. Place Order
        CreateOrderRequest orderReq = CreateOrderRequest.builder()
                .restaurantId(1L)
                .items(List.of(
                        new OrderItemRequest(1L, 2),
                        new OrderItemRequest(3L, 1)
                ))
                .deliveryAddress("742 Evergreen Terrace, Springfield")
                .customerPhone("+1-555-9876")
                .paymentMethod(PaymentMethod.CARD)
                .build();

        MvcResult orderResult = mockMvc.perform(post("/api/customer/orders")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").exists())
                .andExpect(jsonPath("$.status").value("PLACED"))
                .andExpect(jsonPath("$.totalAmount").value(31.22))
                .andReturn();

        JsonNode createdOrder = objectMapper.readTree(orderResult.getResponse().getContentAsString());
        Long orderId = createdOrder.get("id").asLong();

        // 3. Customer views order history
        mockMvc.perform(get("/api/customer/orders")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId));

        // 4. Restaurant Owner views order
        mockMvc.perform(get("/api/owner/restaurants/1/orders")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId));

        // 5. Owner accepts order (PLACED -> ACCEPTED)
        OrderStatusUpdateRequest acceptReq = new OrderStatusUpdateRequest(OrderStatus.ACCEPTED);
        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(acceptReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));

        // 6. Owner updates to PREPARING
        OrderStatusUpdateRequest prepReq = new OrderStatusUpdateRequest(OrderStatus.PREPARING);
        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(prepReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PREPARING"));

        // 7. Owner updates to READY_FOR_PICKUP
        OrderStatusUpdateRequest readyReq = new OrderStatusUpdateRequest(OrderStatus.READY_FOR_PICKUP);
        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(readyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READY_FOR_PICKUP"));

        // 8. Owner views eligible delivery workers and assigns Charlie Driver (ID 3)
        mockMvc.perform(get("/api/owner/delivery-workers/eligible")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        AssignDeliveryRequest assignReq = new AssignDeliveryRequest(3L);
        mockMvc.perform(post("/api/owner/orders/" + orderId + "/assign-delivery")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deliveryWorkerId").value(3L));

        // 9. Delivery Worker sees assigned order
        mockMvc.perform(get("/api/delivery/orders")
                        .header("Authorization", "Bearer " + driverToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId));

        // 10. Worker marks OUT_FOR_DELIVERY
        DeliveryStatusUpdateRequest outReq = new DeliveryStatusUpdateRequest(OrderStatus.OUT_FOR_DELIVERY, null);
        mockMvc.perform(patch("/api/delivery/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(outReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OUT_FOR_DELIVERY"));

        // 11. Worker marks DELIVERED
        DeliveryStatusUpdateRequest deliveredReq = new DeliveryStatusUpdateRequest(OrderStatus.DELIVERED, null);
        mockMvc.perform(patch("/api/delivery/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deliveredReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));

        // 12. Verification on Customer side
        mockMvc.perform(get("/api/customer/orders/" + orderId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"))
                .andExpect(jsonPath("$.deliveryWorkerName").value("Charlie Driver"));
    }

    @Test
    @Order(5)
    void e2e05_failedDeliveryWorkflow() throws Exception {
        String customerToken = loginAndGetToken("customer@muncho.com", "password123");
        String ownerToken = loginAndGetToken("owner@muncho.com", "password123");
        String driverToken = loginAndGetToken("driver@muncho.com", "password123");

        CreateOrderRequest orderReq = CreateOrderRequest.builder()
                .restaurantId(2L)
                .items(List.of(new OrderItemRequest(5L, 1)))
                .deliveryAddress("999 High St, North End")
                .customerPhone("+1-555-4321")
                .paymentMethod(PaymentMethod.CASH)
                .build();

        MvcResult orderRes = mockMvc.perform(post("/api/customer/orders")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isCreated())
                .andReturn();

        Long orderId = objectMapper.readTree(orderRes.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderStatusUpdateRequest(OrderStatus.ACCEPTED))))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderStatusUpdateRequest(OrderStatus.PREPARING))))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/owner/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OrderStatusUpdateRequest(OrderStatus.READY_FOR_PICKUP))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/owner/orders/" + orderId + "/assign-delivery")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new AssignDeliveryRequest(3L))))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/delivery/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new DeliveryStatusUpdateRequest(OrderStatus.OUT_FOR_DELIVERY, null))))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/delivery/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new DeliveryStatusUpdateRequest(OrderStatus.FAILED, null))))
                .andExpect(status().isBadRequest());

        mockMvc.perform(patch("/api/delivery/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new DeliveryStatusUpdateRequest(OrderStatus.FAILED, "Customer address unreachable and phone not responding"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FAILED"))
                .andExpect(jsonPath("$.failureReason").value("Customer address unreachable and phone not responding"));
    }

    @Test
    @Order(6)
    void e2e06_ownerRestaurantAndMenuManagement() throws Exception {
        String ownerToken = loginAndGetToken("owner@muncho.com", "password123");

        RestaurantRequest newRest = RestaurantRequest.builder()
                .name("Taco Fiesta")
                .description("Authentic street tacos and Mexican cantina specialties.")
                .cuisine("Mexican")
                .address("789 Salsa Blvd")
                .phone("+1-555-TACO")
                .imageUrl("https://example.com/taco.jpg")
                .operatingHours("11:00 AM - 10:00 PM")
                .available(true)
                .build();

        MvcResult createRes = mockMvc.perform(post("/api/owner/restaurants")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newRest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Taco Fiesta"))
                .andReturn();

        Long newRestId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asLong();

        DishRequest newDish = DishRequest.builder()
                .name("Birria Tacos (3 pcs)")
                .description("Slow-cooked braised beef tacos with consomme dipping broth.")
                .price(new BigDecimal("13.99"))
                .category("Tacos")
                .available(true)
                .preparationTimeMinutes(12)
                .build();

        MvcResult dishRes = mockMvc.perform(post("/api/owner/restaurants/" + newRestId + "/dishes")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newDish)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Birria Tacos (3 pcs)"))
                .andReturn();

        Long dishId = objectMapper.readTree(dishRes.getResponse().getContentAsString()).get("id").asLong();

        newDish.setPrice(new BigDecimal("14.99"));
        mockMvc.perform(put("/api/owner/dishes/" + dishId)
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newDish)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(14.99));
    }

    @Test
    @Order(7)
    void e2e07_roleBasedAccessControlAndCrossAccountProtection() throws Exception {
        String customerToken = loginAndGetToken("customer@muncho.com", "password123");
        String driverToken = loginAndGetToken("driver@muncho.com", "password123");

        mockMvc.perform(get("/api/owner/restaurants")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/delivery/orders")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/customer/orders")
                        .header("Authorization", "Bearer " + driverToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(8)
    void e2e08_unavailableDishCannotBeOrdered() throws Exception {
        String customerToken = loginAndGetToken("customer@muncho.com", "password123");

        CheckoutPreviewRequest preview = CheckoutPreviewRequest.builder()
                .restaurantId(1L)
                .items(List.of(new OrderItemRequest(4L, 1)))
                .build();

        mockMvc.perform(post("/api/customer/checkout/preview")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(preview)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dish 'Salted Caramel Shake' is currently unavailable."));
    }
}
