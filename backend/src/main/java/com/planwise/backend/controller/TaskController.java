package com.planwise.backend.controller;

import com.planwise.backend.dto.StatusRequest;
import com.planwise.backend.dto.TaskRequest;
import com.planwise.backend.entity.Task;
import com.planwise.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) String labelId,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy
    ) {
        return ResponseEntity.ok(taskService.getTasks(labelId, priority, status, sortBy));
    }

    @GetMapping("/kanban")
    public ResponseEntity<Map<String, List<Task>>> getKanbanBoard() {
        return ResponseEntity.ok(taskService.getKanbanBoard());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.getOverdueTasks());
    }

    @GetMapping("/{id}/overdue")
    public ResponseEntity<Boolean> checkOverdue(@PathVariable String id) {
        return ResponseEntity.ok(taskService.checkOverdue(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable String id, @RequestBody StatusRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(id, request.status()));
    }

    @PostMapping("/{taskId}/labels/{labelId}")
    public ResponseEntity<Task> addLabel(@PathVariable String taskId, @PathVariable String labelId) {
        return ResponseEntity.ok(taskService.addLabel(taskId, labelId));
    }

    @DeleteMapping("/{taskId}/labels/{labelId}")
    public ResponseEntity<Task> removeLabel(@PathVariable String taskId, @PathVariable String labelId) {
        return ResponseEntity.ok(taskService.removeLabel(taskId, labelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/overdue/notify")
    public ResponseEntity<List<Task>> notifyOverdueTasks() {
        return ResponseEntity.ok(taskService.notifyOverdueTasks());
    }
}
