package com.campus.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campus.bus.entity.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}