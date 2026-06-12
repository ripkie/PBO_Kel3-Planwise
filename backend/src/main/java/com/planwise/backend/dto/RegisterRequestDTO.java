package com.planwise.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank
    private String nama;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
