package com.campus.bus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campus.bus.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}