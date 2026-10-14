package com.campus.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.bus.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {
}