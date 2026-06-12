package com.planwise.backend.dto;

import com.planwise.backend.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusDTO {
    @NotNull
    private TaskStatus status;
}
