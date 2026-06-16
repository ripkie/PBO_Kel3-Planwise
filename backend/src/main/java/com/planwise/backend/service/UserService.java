package com.planwise.backend.service;

import com.planwise.backend.dto.LoginRequest;
import com.planwise.backend.dto.RegisterRequest;
import com.planwise.backend.entity.User;
import com.planwise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email sudah terdaftar");
        }

        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .nama(request.nama())
                .email(request.email())
                .password(request.password())
                .build();

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email tidak ditemukan"));

        if (!user.getPassword().equals(request.password())) {
            throw new RuntimeException("Password salah");
        }

        return user;
    }

    public String logout() {
        return "Logout berhasil";
    }

    public User getProfile(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan: " + id));
    }

    public List<User> getAllUsers() {
    return userRepository.findAll();
}
}