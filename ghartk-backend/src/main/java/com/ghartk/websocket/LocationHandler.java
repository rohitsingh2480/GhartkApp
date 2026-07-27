package com.ghartk.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
public class LocationHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<Long, Set<WebSocketSession>> orderSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String query = session.getUri().getQuery();
        if (query != null && query.contains("orderId=")) {
            try {
                String orderIdStr = query.split("orderId=")[1].split("&")[0];
                Long orderId = Long.parseLong(orderIdStr);
                orderSessions.computeIfAbsent(orderId, k -> new CopyOnWriteArraySet<>()).add(session);
                log.info("Client connected to track order {}", orderId);
            } catch (Exception e) {
                log.warn("Invalid orderId in query string: {}", query);
                session.close(CloseStatus.BAD_DATA);
            }
        } else {
            log.warn("No orderId provided in connection query string");
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
            if (payload.containsKey("orderId") && payload.containsKey("latitude") && payload.containsKey("longitude")) {
                Long orderId = Long.valueOf(payload.get("orderId").toString());
                Double lat = Double.valueOf(payload.get("latitude").toString());
                Double lng = Double.valueOf(payload.get("longitude").toString());
                broadcastLocation(orderId, lat, lng);
            }
        } catch (Exception e) {
            log.error("Error parsing coordinate message: {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        orderSessions.forEach((orderId, sessions) -> {
            if (sessions.remove(session)) {
                log.info("Client disconnected from tracking order {}", orderId);
            }
        });
    }

    public void broadcastLocation(Long orderId, Double latitude, Double longitude) {
        Set<WebSocketSession> sessions = orderSessions.get(orderId);
        if (sessions != null && !sessions.isEmpty()) {
            Map<String, Object> msg = Map.of(
                "orderId", orderId,
                "latitude", latitude,
                "longitude", longitude,
                "timestamp", System.currentTimeMillis()
            );
            try {
                String json = objectMapper.writeValueAsString(msg);
                TextMessage textMessage = new TextMessage(json);
                for (WebSocketSession session : sessions) {
                    if (session.isOpen()) {
                        session.sendMessage(textMessage);
                    }
                }
            } catch (IOException e) {
                log.error("Failed to broadcast location for order {}: {}", orderId, e.getMessage());
            }
        }
    }
}
