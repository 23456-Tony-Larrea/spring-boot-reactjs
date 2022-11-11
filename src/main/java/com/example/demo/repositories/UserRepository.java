package com.example.demo.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.UserModels;

@Repository
public interface UserRepository extends CrudRepository<UserModels, Long> {
    UserModels findByEmail(String email);
}
