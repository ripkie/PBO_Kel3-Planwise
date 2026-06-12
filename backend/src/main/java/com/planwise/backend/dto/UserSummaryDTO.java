package com.planwise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDTO {
    private String id;
    private String nama;
    private String email;
}
