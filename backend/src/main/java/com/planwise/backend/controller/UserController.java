package com.planwise.backend.controller;

import com.planwise.backend.dto.LoginRequest;
import com.planwise.backend.dto.RegisterRequest;
import com.planwise.backend.entity.User;
import com.planwise.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(userService.login(request));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", userService.logout()));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<User> getProfile(@PathVariable String id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }
}