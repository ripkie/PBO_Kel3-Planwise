package com.planwise.backend.controller;

import com.planwise.backend.entity.History;
import com.planwise.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/histories")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    // GET /api/histories/task/{taskId} - riwayat berdasarkan task
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<History>> getByTask(@PathVariable String taskId) {
        return ResponseEntity.ok(historyService.getHistoryByTask(taskId));
    }

    // GET /api/histories/task/{taskId}/sorted - riwayat terurut
    @GetMapping("/task/{taskId}/sorted")
    public ResponseEntity<List<History>> getSorted(@PathVariable String taskId) {
        return ResponseEntity.ok(historyService.sortingHistory(taskId));
    }

    // GET /api/histories/management/{managementTaskId}
    @GetMapping("/management/{managementTaskId}")
    public ResponseEntity<List<History>> getByManagementTask(@PathVariable String managementTaskId) {
        return ResponseEntity.ok(historyService.getHistoryByManagementTask(managementTaskId));
    }

    // GET /api/histories - semua riwayat
    @GetMapping
    public ResponseEntity<List<History>> getAll() {
        return ResponseEntity.ok(historyService.getHistoryList());
    }
}