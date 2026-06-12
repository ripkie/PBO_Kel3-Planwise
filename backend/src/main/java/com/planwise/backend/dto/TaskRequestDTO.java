package com.planwise.backend.dto;

import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequestDTO {

    @NotBlank(message = "Judul task tidak boleh kosong")
    private String judul;

    private String deskripsi;
    private LocalDate deadline;
    private TaskStatus status;
    private Priority prioritas;
    private List<String> labelIds;

    // For PersonalTask
    private String ownerId;

    // For GroupTask
    private List<String> memberIds;
    private String assignedToId;

    // Discriminator: PERSONAL | GROUP | DEADLINE
    private String taskType;
}
