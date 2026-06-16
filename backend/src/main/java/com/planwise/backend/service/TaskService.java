package com.planwise.backend.service;

import com.planwise.backend.dto.TaskRequest;
import com.planwise.backend.entity.Label;
import com.planwise.backend.entity.Task;
import com.planwise.backend.entity.User;
import com.planwise.backend.repository.LabelRepository;
import com.planwise.backend.repository.TaskRepository;
import com.planwise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final NotificationService notificationService;
    private final TaskRepository taskRepository;
    private final LabelRepository labelRepository;
    private final HistoryService historyService;
    private final UserRepository userRepository;

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

    @Transactional(readOnly = true)
    public List<Task> getMyTasks(String userId) {
        return taskRepository.findByOwnerIdWithLabels(userId);
    }

    @Transactional
    public Task createTask(TaskRequest request) {
        User owner = null;

        if (request.ownerId() != null && !request.ownerId().isBlank()) {
            owner = userRepository.findById(request.ownerId())
                    .orElseThrow(() -> new RuntimeException("Owner tidak ditemukan: " + request.ownerId()));
        }

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
                .owner(owner)
                .build();

        Task savedTask = taskRepository.save(task);

        notificationService.send(
                savedTask,
                savedTask.getOwner(),
                "Task baru dibuat: " + savedTask.getJudul()
        );

        historyService.historyTask(
                savedTask,
                "Task dibuat",
                savedTask.getOwner()
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

        notificationService.send(
                updatedTask,
                updatedTask.getOwner(),
                "Task '" + updatedTask.getJudul() + "' diperbarui"
        );

        historyService.historyTask(
                updatedTask,
                "Task diperbarui",
                updatedTask.getOwner()
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
                updatedTask.getOwner(),
                "Status task '" + updatedTask.getJudul() + "' berubah menjadi " + updatedTask.getStatus()
        );

        historyService.historyTask(
                updatedTask,
                "Status diubah dari " + oldStatus + " ke " + status,
                updatedTask.getOwner()
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

        notificationService.send(
                updatedTask,
                updatedTask.getOwner(),
                "Label '" + label.getNama() + "' ditambahkan ke task '" + updatedTask.getJudul() + "'"
        );

        historyService.historyTask(
                updatedTask,
                "Menambahkan label: " + label.getNama(),
                updatedTask.getOwner()
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

        notificationService.send(
                updatedTask,
                updatedTask.getOwner(),
                "Label '" + label.getNama() + "' dihapus dari task '" + updatedTask.getJudul() + "'"
        );

        historyService.historyTask(
                updatedTask,
                "Menghapus label: " + label.getNama(),
                updatedTask.getOwner()
        );

        return updatedTask;
    }

    @Transactional
    public void deleteTask(String id) {
        Task task = getTask(id);

        historyService.historyTask(
                task,
                "Task dihapus",
                task.getOwner()
        );

        notificationService.send(
                task,
                task.getOwner(),
                "Task '" + task.getJudul() + "' dihapus"
        );

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public Map<String, List<Task>> getKanbanBoard() {
        Map<String, List<Task>> board = new LinkedHashMap<>();

        board.put("TODO", taskRepository.findByStatusIgnoreCase("TODO"));
        board.put("IN_PROGRESS", taskRepository.findByStatusIgnoreCase("IN_PROGRESS"));
        board.put("REVIEW", taskRepository.findByStatusIgnoreCase("REVIEW"));
        board.put("DONE", taskRepository.findByStatusIgnoreCase("DONE"));

        return board;
    }

    @Transactional(readOnly = true)
    public List<Task> getOverdueTasks() {
        return taskRepository.findAllWithLabels().stream()
                .filter(task -> task.getDeadline() != null)
                .filter(task -> task.getDeadline().isBefore(LocalDate.now()))
                .filter(task -> task.getStatus() == null || !task.getStatus().equalsIgnoreCase("DONE"))
                .toList();
    }

    @Transactional(readOnly = true)
    public Boolean checkOverdue(String id) {
        Task task = getTask(id);

        return task.getDeadline() != null
                && task.getDeadline().isBefore(LocalDate.now())
                && (task.getStatus() == null || !task.getStatus().equalsIgnoreCase("DONE"));
    }

    @Transactional
    public List<Task> notifyOverdueTasks() {
        List<Task> overdueTasks = getOverdueTasks();

        for (Task task : overdueTasks) {
            notificationService.send(
                    task,
                    task.getOwner(),
                    "Task '" + task.getJudul() + "' sudah melewati deadline"
            );

            historyService.historyTask(
                    task,
                    "Task melewati deadline",
                    task.getOwner()
            );
        }

        return overdueTasks;
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