package com.campus.bus.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Smart Campus Bus Backend API is active and healthy");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "smart-campus-bus");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}

