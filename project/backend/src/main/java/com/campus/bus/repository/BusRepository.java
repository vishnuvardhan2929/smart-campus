package com.campus.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.bus.entity.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {

}