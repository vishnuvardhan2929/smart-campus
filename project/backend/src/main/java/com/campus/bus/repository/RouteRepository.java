package com.campus.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.bus.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
}