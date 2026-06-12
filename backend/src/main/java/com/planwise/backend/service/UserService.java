package com.planwise.backend.service;

import com.planwise.backend.dto.*;
import com.planwise.backend.entity.User;
import com.planwise.backend.enums.Role;
import com.planwise.backend.exception.BadRequestException;
import com.planwise.backend.exception.ResourceNotFoundException;
import com.planwise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserResponseDTO register(RegisterRequestDTO req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email sudah terdaftar: " + req.getEmail());

        User user = User.builder()
            .nama(req.getNama())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(Role.USER)
            .build();

        return toDTO(userRepository.save(user));
    }

    public UserResponseDTO login(LoginRequestDTO req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new BadRequestException("Email atau password salah"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new BadRequestException("Email atau password salah");

        return toDTO(user);
    }

    public UserResponseDTO getProfile(String id) {
        return userRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan: " + id));
    }

    private UserResponseDTO toDTO(User u) {
        return UserResponseDTO.builder()
            .id(u.getId())
            .nama(u.getNama())
            .email(u.getEmail())
            .role(u.getRole())
            .build();
    }
}
