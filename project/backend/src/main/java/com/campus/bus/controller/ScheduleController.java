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

import com.campus.bus.entity.Schedule;
import com.campus.bus.service.ScheduleService;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService service;

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return service.createSchedule(schedule);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return service.getAllSchedules();
    }

    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable Long id) {
        return service.getScheduleById(id);
    }

    @PutMapping("/{id}")
    public Schedule updateSchedule(
            @PathVariable Long id,
            @RequestBody Schedule schedule) {
        return service.updateSchedule(id, schedule);
    }

    @DeleteMapping("/{id}")
    public String deleteSchedule(@PathVariable Long id) {
        return service.deleteSchedule(id);
    }
}