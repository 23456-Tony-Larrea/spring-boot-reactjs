package com.example.demo.controllers;

import com.example.demo.models.UserModels;
import com.example.demo.services.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    UserService userService;
    @GetMapping()
    public ArrayList<UserModels> allUsers() {
        return userService.allUsers();
    }
    @PostMapping()
    public UserModels saveUser(@RequestBody UserModels user) {
        return userService.saveUser(user);
    }
    
    @GetMapping(path = "/{id}")
    public Optional<UserModels> findUserById(@PathVariable("id") Long id) {
        return this.userService.findById(id);
    }
    @DeleteMapping(path = "/{id}")
    public String DeleteUser(@PathVariable("id") Long id) {
            boolean ok=this.userService.DeleteUser(id);
            if(ok){
                return "Se ha eliminado el usuario con el id: "+id;
            }else{
            return "No se pudo eliminar el usuario con el id: "+id;
            }
            }
    
    @PutMapping(path = "/{id}")
    public UserModels updateUser(@RequestBody UserModels user, @PathVariable("id") Long id) {
        user.setId(id);
        return this.userService.saveUser(user);
    }
    
}