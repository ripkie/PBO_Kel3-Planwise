package com.planwise.backend.interfaces;

import com.planwise.backend.entity.Task;
import com.planwise.backend.entity.Label;

import java.util.List;

public interface Filterable {
    List<Task> filterByLabel(Label label);
    List<Task> filterByPriority(String priority);
    List<Task> filterByStatus(String status);
}
