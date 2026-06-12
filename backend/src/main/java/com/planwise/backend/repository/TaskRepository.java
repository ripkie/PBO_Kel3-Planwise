package com.planwise.backend.repository;

import com.planwise.backend.entity.Task;
import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPrioritas(Priority priority);
}
