package com.planwise.backend.dto;

public record LoginRequest(
        String email,
        String password
) {}