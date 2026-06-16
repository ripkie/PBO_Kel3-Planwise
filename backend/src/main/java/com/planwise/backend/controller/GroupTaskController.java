package com.planwise.backend.controller;

import com.planwise.backend.entity.GroupTask;
import com.planwise.backend.service.GroupTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/group-tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GroupTaskController {

    private final GroupTaskService groupTaskService;

    @PostMapping("/{taskId}/members/{userId}")
    public ResponseEntity<String> addMember(
            @PathVariable String taskId,
            @PathVariable String userId
    ) {
        groupTaskService.addMember(taskId, userId);
        return ResponseEntity.ok("Member berhasil ditambahkan ke group task");
    }

    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<String> assignTo(
            @PathVariable String taskId,
            @PathVariable String userId
    ) {
        groupTaskService.assignTo(taskId, userId);
        return ResponseEntity.ok("Task berhasil di-assign ke user");
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<GroupTask> getGroupTask(@PathVariable String taskId) {
        return ResponseEntity.ok(groupTaskService.getGroupTask(taskId));
    }

    @PostMapping
    public ResponseEntity<GroupTask> createGroupTask(@RequestBody GroupTask groupTask) {
        return ResponseEntity.ok(groupTaskService.createGroupTask(groupTask));
    }
}