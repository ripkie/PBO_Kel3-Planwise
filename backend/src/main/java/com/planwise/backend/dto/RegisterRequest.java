package com.planwise.backend.dto;

public record RegisterRequest(
        String nama,
        String email,
        String password
) {}