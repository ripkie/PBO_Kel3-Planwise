package com.planwise.backend.dto;

import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskResponseDTO {
    private String id;
    private String judul;
    private String deskripsi;
    private LocalDate deadline;
    private TaskStatus status;
    private Priority prioritas;
    private LocalDateTime createdAt;
    private List<LabelDTO> labels;
    private String taskType;

    // PersonalTask
    private UserSummaryDTO owner;

    // GroupTask
    private List<UserSummaryDTO> members;
    private UserSummaryDTO assignedTo;

    // DeadlineTask
    private Boolean isOverdue;
}
