package com.campus.bus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.bus.entity.Driver;
import com.campus.bus.repository.DriverRepository;

@Service
public class DriverService {

    @Autowired
    private DriverRepository repository;

    // Create Driver
    public Driver createDriver(Driver driver) {
        return repository.save(driver);
    }

    // Get All Drivers
    public List<Driver> getAllDrivers() {
        return repository.findAll();
    }

    // Get Driver by ID
    public Driver getDriverById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Driver
    public Driver updateDriver(Long id, Driver driver) {

        Driver existingDriver = repository.findById(id).orElse(null);

        if (existingDriver != null) {

            existingDriver.setDriverName(driver.getDriverName());
            existingDriver.setPhoneNumber(driver.getPhoneNumber());
            existingDriver.setLicenseNumber(driver.getLicenseNumber());
            existingDriver.setAddress(driver.getAddress());

            return repository.save(existingDriver);
        }

        return null;
    }

    // Delete Driver
    public String deleteDriver(Long id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Driver deleted successfully";
        }

        return "Driver not found";
    }
}