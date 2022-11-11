package com.example.demo.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.UserModels;
import com.example.demo.repositories.UserRepository;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public ArrayList<UserModels> allUsers() {
        return (ArrayList<UserModels>) userRepository.findAll();
    }

    public UserModels saveUser(UserModels user) {
        return userRepository.save(user);
    }

    public Optional<UserModels> findById(Long id){
        return userRepository.findById(id);
    }

    public Boolean DeleteUser(Long id){
        try{
            userRepository.deleteById(id);
            return true;
        }catch(Exception err){
            return false;
        }
    }
    
    public Optional<UserModels>updateUser(Long id){
        return userRepository.findById(id);

    }
    
}
