package com.planwise.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LabelDTO {
    private String id;

    @NotBlank
    private String nama;

    @NotBlank
    private String warna;
}
