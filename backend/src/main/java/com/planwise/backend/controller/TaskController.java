package com.planwise.backend.controller;

import com.planwise.backend.dto.*;
import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import com.planwise.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /** GET /api/tasks — ambil semua task (bisa filter by status/prioritas) */
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(
        @RequestParam(required = false) TaskStatus status,
        @RequestParam(required = false) Priority prioritas
    ) {
        List<TaskResponseDTO> tasks;
        if (status != null) {
            tasks = taskService.filterByStatus(status);
        } else if (prioritas != null) {
            tasks = taskService.filterByPriority(prioritas);
        } else {
            tasks = taskService.getAllTasks();
        }
        return ResponseEntity.ok(tasks);
    }

    /** GET /api/tasks/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    /** POST /api/tasks */
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(dto));
    }

    /** PUT /api/tasks/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
        @PathVariable String id,
        @Valid @RequestBody TaskRequestDTO dto
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, dto));
    }

    /** PATCH /api/tasks/{id}/status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDTO> updateStatus(
        @PathVariable String id,
        @Valid @RequestBody UpdateStatusDTO dto
    ) {
        return ResponseEntity.ok(taskService.updateStatus(id, dto));
    }

    /** DELETE /api/tasks/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/tasks/{id}/history */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<HistoryResponseDTO>> getHistory(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getHistoryByTask(id));
    }
}
