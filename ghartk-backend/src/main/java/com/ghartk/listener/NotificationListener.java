package com.ghartk.listener;

import com.ghartk.entity.Order;
import com.ghartk.entity.OrderStatus;
import com.ghartk.event.OrderStateChangeEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {

    
    @Async
    @EventListener
    public void handleOrderStateChange(OrderStateChangeEvent event) {
        Order order = event.getOrder();
        String customerPhone = order.getUser().getPhone();
        String customerName = order.getUser().getName();
        String orderNumber = order.getOrderNumber();
        OrderStatus status = order.getStatus();

        String message = getNotificationMessage(customerName, orderNumber, status);
        
        log.info("========================================= NOTIFICATION ENGINE =========================================");
        
        // Mock Twilio SMS
        log.info("[MOCK TWILIO SMS] Sending to {}: \"{}\"", customerPhone, message);

        // Mock Firebase Push Notification (FCM)
        log.info("[MOCK FCM PUSH] Target User ID: {}, Title: \"GHARTK Order Update\", Body: \"{}\"", 
                 order.getUser().getId(), message);
                 
        log.info("=======================================================================================================");
    }

    private String getNotificationMessage(String customerName, String orderNumber, OrderStatus status) {
        return switch (status) {
            case PLACED -> String.format("Hi %s, your GHARTK order %s has been placed successfully! We're sending it to the store.", customerName, orderNumber);
            case CONFIRMED -> String.format("Great news %s! Store has confirmed your order %s. Preparation is starting.", customerName, orderNumber);
            case PREPARING -> String.format("Hi %s, your order %s is currently being prepared with care by our store partner.", customerName, orderNumber);
            case OUT_FOR_DELIVERY -> String.format("Out for Delivery! Your GHARTK order %s is on its way. Track it live on our app!", orderNumber);
            case DELIVERED -> String.format("Delivered! Enjoy your GHARTK items. Thanks for ordering, %s!", customerName);
            case CANCELLED -> String.format("Alert: Your GHARTK order %s has been cancelled. If this is a mistake, contact support.", orderNumber);
        };
    }
}
