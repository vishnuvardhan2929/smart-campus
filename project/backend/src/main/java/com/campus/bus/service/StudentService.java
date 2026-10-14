package com.campus.bus.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.bus.entity.Student;
import com.campus.bus.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public Student createStudent(Student student) {
        return repository.save(student);
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student updateStudent(Long id, Student student) {

        Student existingStudent = repository.findById(id).orElse(null);

        if (existingStudent != null) {

            existingStudent.setStudentName(student.getStudentName());
            existingStudent.setRollNumber(student.getRollNumber());
            existingStudent.setPhoneNumber(student.getPhoneNumber());
            existingStudent.setDepartment(student.getDepartment());
            existingStudent.setYear(student.getYear());

            return repository.save(existingStudent);
        }

        return null;
    }

    public String deleteStudent(Long id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Student deleted successfully";
        }

        return "Student not found";
    }
}