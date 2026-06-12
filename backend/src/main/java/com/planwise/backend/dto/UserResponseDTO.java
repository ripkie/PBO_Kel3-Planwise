package com.planwise.backend.dto;

import com.planwise.backend.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {
    private String id;
    private String nama;
    private String email;
    private Role role;
}
