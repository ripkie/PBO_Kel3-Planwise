package com.planwise.backend.service;

import com.planwise.backend.dto.TaskRequest;
import com.planwise.backend.entity.Label;
import com.planwise.backend.entity.Task;
import com.planwise.backend.repository.LabelRepository;
import com.planwise.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class TaskService {
    private final NotificationService notificationService;

    private final TaskRepository taskRepository;
    private final LabelRepository labelRepository;
    private final HistoryService historyService;

    @Transactional(readOnly = true)
    public List<Task> getTasks(String labelId, String priority, String status, String sortBy) {
        List<Task> tasks;

        if (labelId != null && !labelId.isBlank()) {
            tasks = taskRepository.findByLabelId(labelId);
        } else if (priority != null && !priority.isBlank()) {
            tasks = taskRepository.findByPrioritasIgnoreCase(priority);
        } else if (status != null && !status.isBlank()) {
            tasks = taskRepository.findByStatusIgnoreCase(status);
        } else {
            tasks = taskRepository.findAllWithLabels();
        }

        if (priority != null && !priority.isBlank() && labelId != null && !labelId.isBlank()) {
            tasks = tasks.stream()
                    .filter(task -> priority.equalsIgnoreCase(task.getPrioritas()))
                    .toList();
        }

        if (status != null && !status.isBlank()
                && ((labelId != null && !labelId.isBlank()) || (priority != null && !priority.isBlank()))) {
            tasks = tasks.stream()
                    .filter(task -> status.equalsIgnoreCase(task.getStatus()))
                    .toList();
        }

        return sortTasks(tasks, sortBy);
    }

    @Transactional(readOnly = true)
    public Task getTask(String id) {
        return taskRepository.findWithLabelsById(id)
                .orElseThrow(() -> new RuntimeException("Task tidak ditemukan: " + id));
    }

    @Transactional
    public Task createTask(TaskRequest request) {
        Task task = Task.builder()
                .id(UUID.randomUUID().toString())
                .judul(request.judul())
                .deskripsi(request.deskripsi())
                .deadline(request.deadline())
                .status(request.status() == null || request.status().isBlank() ? "TODO" : request.status())
                .prioritas(request.prioritas() == null || request.prioritas().isBlank() ? "LOW" : request.prioritas())
                .createdAt(Instant.now())
                .taskType(request.taskType() == null || request.taskType().isBlank() ? "TASK" : request.taskType())
                .labels(resolveLabels(request.labelIds()))
                .build();

        Task savedTask = taskRepository.save(task);

        notificationService.send(
                savedTask,
                 null,
                 "Task baru dibuat: " + savedTask.getJudul()
        );

        historyService.historyTask(
                savedTask,
                "Task dibuat",
                null
        );

        return savedTask;
    }

    @Transactional
    public Task updateTask(String id, TaskRequest request) {
        Task task = getTask(id);

        if (request.judul() != null) task.setJudul(request.judul());
        if (request.deskripsi() != null) task.setDeskripsi(request.deskripsi());
        if (request.deadline() != null) task.setDeadline(request.deadline());
        if (request.status() != null) task.setStatus(request.status());
        if (request.prioritas() != null) task.setPrioritas(request.prioritas());
        if (request.taskType() != null) task.setTaskType(request.taskType());
        if (request.labelIds() != null) task.setLabels(resolveLabels(request.labelIds()));

        Task updatedTask = taskRepository.save(task);

        historyService.historyTask(
                updatedTask,
                "Task diperbarui",
                null
        );

        return updatedTask;
    }

    @Transactional
    public Task updateStatus(String id, String status) {
        Task task = getTask(id);

        String oldStatus = task.getStatus();

        task.updateStatus(status);

        Task updatedTask = taskRepository.save(task);

        notificationService.send(
                updatedTask,
                null,
                "Status task '" +
                updatedTask.getJudul() +
                "' berubah menjadi " +
                updatedTask.getStatus()
        );

        historyService.historyTask(
                updatedTask,
                "Status diubah dari " + oldStatus + " ke " + status,
                null
        );

        return updatedTask;
    }

    @Transactional
    public Task addLabel(String taskId, String labelId) {
        Task task = getTask(taskId);
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label tidak ditemukan: " + labelId));

        task.addLabel(label);

        Task updatedTask = taskRepository.save(task);

        historyService.historyTask(
                updatedTask,
                "Menambahkan label: " + label.getNama(),
                null
        );

        return updatedTask;
    }

    @Transactional
    public Task removeLabel(String taskId, String labelId) {
        Task task = getTask(taskId);
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label tidak ditemukan: " + labelId));

        task.removeLabel(label);

        Task updatedTask = taskRepository.save(task);

        historyService.historyTask(
                updatedTask,
                "Menghapus label: " + label.getNama(),
                null
        );

        return updatedTask;
    }

    @Transactional
    public void deleteTask(String id) {
        Task task = getTask(id);

        historyService.historyTask(
                task,
                "Task dihapus",
                null
        );

        taskRepository.delete(task);
    }

    private List<Label> resolveLabels(List<String> labelIds) {
        if (labelIds == null || labelIds.isEmpty()) {
            return List.of();
        }

        return labelRepository.findAllById(labelIds);
    }

    private List<Task> sortTasks(List<Task> tasks, String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return tasks;
        }

        return switch (sortBy.toLowerCase()) {
            case "deadline" -> tasks.stream()
                    .sorted(Comparator.comparing(
                            Task::getDeadline,
                            Comparator.nullsLast(Comparator.naturalOrder())
                    ))
                    .toList();

            case "priority", "prioritas" -> tasks.stream()
                    .sorted(Comparator.comparingInt(this::priorityWeight))
                    .toList();

            case "createdat", "created_at" -> tasks.stream()
                    .sorted(Comparator.comparing(
                            Task::getCreatedAt,
                            Comparator.nullsLast(Comparator.reverseOrder())
                    ))
                    .toList();

            default -> tasks;
        };
    }

    private int priorityWeight(Task task) {
        if (task.getPrioritas() == null) {
            return 99;
        }

        return switch (task.getPrioritas().toUpperCase()) {
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            default -> 99;
        };
    }
}