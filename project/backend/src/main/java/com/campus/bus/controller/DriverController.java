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

import com.campus.bus.entity.Driver;
import com.campus.bus.service.DriverService;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService service;

    // Create Driver
    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return service.createDriver(driver);
    }

    // Get All Drivers
    @GetMapping
    public List<Driver> getAllDrivers() {
        return service.getAllDrivers();
    }

    // Get Driver by ID
    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return service.getDriverById(id);
    }

    // Update Driver
    @PutMapping("/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        return service.updateDriver(id, driver);
    }

    // Delete Driver
    @DeleteMapping("/{id}")
    public String deleteDriver(@PathVariable Long id) {
        return service.deleteDriver(id);
    }
}