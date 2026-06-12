package com.planwise.backend.interfaces;

import com.planwise.backend.dto.TaskResponseDTO;
import com.planwise.backend.entity.Label;
import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;

import java.util.List;

public interface Filterable {
    List<TaskResponseDTO> filterByLabel(Label label);
    List<TaskResponseDTO> filterByPriority(Priority priority);
    List<TaskResponseDTO> filterByStatus(TaskStatus status);
}
