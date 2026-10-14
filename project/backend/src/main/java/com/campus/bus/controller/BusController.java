package com.campus.bus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.bus.entity.Bus;
import com.campus.bus.service.BusService;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = {"https://smart-campus-git-main-vishnuvardhan2929.vercel.app", "https://smart-campus-seven-sage.vercel.app", "http://localhost:5173", "http://localhost:3000"}, allowedHeaders = "*")
public class BusController {

    @Autowired
    private BusService service;

    // Create Bus
    @PostMapping
    public Bus createBus(@RequestBody Bus bus) {
        return service.createBus(bus);
    }

    // Get all Buses
    @GetMapping
    public List<Bus> getAllBuses() {
        return service.getAllBuses();
    }

    // Get Bus by ID
    @GetMapping("/{id}")
    public Bus getBusById(@PathVariable Long id) {
        return service.getBusById(id);
    }

    // Update Bus
    @PutMapping("/{id}")
    public Bus updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        return service.updateBus(id, bus);
    }

    // Delete Bus
    @DeleteMapping("/{id}")
    public String deleteBus(@PathVariable Long id) {
        service.deleteBus(id);
        return "Bus deleted successfully";
    }
}