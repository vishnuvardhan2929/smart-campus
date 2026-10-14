package com.campus.bus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.bus.entity.Route;
import com.campus.bus.repository.RouteRepository;

@Service
public class RouteService {

    @Autowired
    private RouteRepository repository;

    // Create Route
    public Route createRoute(Route route) {
        return repository.save(route);
    }

    // Get All Routes
    public List<Route> getAllRoutes() {
        return repository.findAll();
    }

    // Get Route by ID
    public Route getRouteById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Route
    public Route updateRoute(Long id, Route route) {

        Route existingRoute = repository.findById(id).orElse(null);

        if (existingRoute != null) {

            existingRoute.setRouteName(route.getRouteName());
            existingRoute.setStartPoint(route.getStartPoint());
            existingRoute.setDestination(route.getDestination());
            existingRoute.setStops(route.getStops());

            return repository.save(existingRoute);
        }

        return null;
    }

    // Delete Route
    public String deleteRoute(Long id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Route deleted successfully";
        }

        return "Route not found";
    }
}