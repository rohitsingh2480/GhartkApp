package com.ghartk.event;

import com.ghartk.entity.Order;
import lombok.Getter;
@Getter
public class OrderStateChangeEvent {
    private final Order order;

    public OrderStateChangeEvent(Order order) {
        this.order = order;
    }
}
