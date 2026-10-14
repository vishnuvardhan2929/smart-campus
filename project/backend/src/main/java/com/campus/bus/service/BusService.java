package com.campus.bus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.bus.entity.Bus;
import com.campus.bus.repository.BusRepository;

@Service
public class BusService {

    @Autowired
    private BusRepository repository;

    // Create Bus
    public Bus createBus(Bus bus) {
        return repository.save(bus);
    }

    // Get all Buses
    public List<Bus> getAllBuses() {
        return repository.findAll();
    }

    // Get Bus by ID
    public Bus getBusById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update Bus
    public Bus updateBus(Long id, Bus bus) {

        Bus existingBus = repository.findById(id).orElse(null);

        if (existingBus != null) {

            existingBus.setBusNumber(bus.getBusNumber());
            existingBus.setBusType(bus.getBusType());
            existingBus.setTotalSeats(bus.getTotalSeats());
            existingBus.setAvailableSeats(bus.getAvailableSeats());
            existingBus.setStatus(bus.getStatus());

            return repository.save(existingBus);
        }

        return null;
    }

    // Delete Bus
    public void deleteBus(Long id) {
        repository.deleteById(id);
    }
}