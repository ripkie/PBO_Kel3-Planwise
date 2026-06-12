package com.planwise.backend.controller;

import com.planwise.backend.dto.*;
import com.planwise.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** POST /api/users/register */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    /** POST /api/users/login */
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    /** GET /api/users/{id}/profile */
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserResponseDTO> getProfile(@PathVariable String id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }
}
