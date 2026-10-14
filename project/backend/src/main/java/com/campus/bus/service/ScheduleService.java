package com.campus.bus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.bus.entity.Schedule;
import com.campus.bus.repository.ScheduleRepository;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository repository;

    public Schedule createSchedule(Schedule schedule) {
        return repository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return repository.findAll();
    }

    public Schedule getScheduleById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Schedule updateSchedule(Long id, Schedule schedule) {

        Schedule existingSchedule = repository.findById(id).orElse(null);

        if (existingSchedule != null) {

            existingSchedule.setBusNumber(schedule.getBusNumber());
            existingSchedule.setRouteName(schedule.getRouteName());
            existingSchedule.setDepartureTime(schedule.getDepartureTime());
            existingSchedule.setArrivalTime(schedule.getArrivalTime());
            existingSchedule.setDay(schedule.getDay());

            return repository.save(existingSchedule);
        }

        return null;
    }

    public String deleteSchedule(Long id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Schedule deleted successfully";
        }

        return "Schedule not found";
    }
}