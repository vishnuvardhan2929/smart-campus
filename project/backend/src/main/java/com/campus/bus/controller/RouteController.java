package com.campus.bus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.bus.entity.Route;
import com.campus.bus.service.RouteService;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RouteService service;

    // Create Route
    @PostMapping
    public Route createRoute(@RequestBody Route route) {
        return service.createRoute(route);
    }

    // Get All Routes
    @GetMapping
    public List<Route> getAllRoutes() {
        return service.getAllRoutes();
    }

    // Get Route by ID
    @GetMapping("/{id}")
    public Route getRouteById(@PathVariable Long id) {
        return service.getRouteById(id);
    }

    // Update Route
    @PutMapping("/{id}")
    public Route updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return service.updateRoute(id, route);
    }

    // Delete Route
    @DeleteMapping("/{id}")
    public String deleteRoute(@PathVariable Long id) {
        return service.deleteRoute(id);
    }
}