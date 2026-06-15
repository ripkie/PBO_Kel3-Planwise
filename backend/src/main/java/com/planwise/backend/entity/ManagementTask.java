package com.planwise.backend.entity;

import com.planwise.backend.interfaces.Filterable;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Entity
@Table(name = "management_tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ManagementTask implements Filterable {

    @Id
    private String id;

    private String nama;

    @OneToMany(mappedBy = "managementTask")
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "managementTask")
    @Builder.Default
    private List<History> histories = new ArrayList<>();

    public Task createTask(Task data) {
        tasks.add(data);
        return data;
    }

    public Task updateTask(String id, Task data) {
        return tasks.stream().filter(task -> task.getId().equals(id)).findFirst().map(task -> {
            task.setJudul(data.getJudul());
            task.setDeskripsi(data.getDeskripsi());
            task.setDeadline(data.getDeadline());
            task.setPrioritas(data.getPrioritas());
            task.setStatus(data.getStatus());
            return task;
        }).orElse(null);
    }

    public void deleteTask(String id) {
        tasks.removeIf(task -> task.getId().equals(id));
    }

    public Task getTask(String id) {
        return tasks.stream().filter(task -> task.getId().equals(id)).findFirst().orElse(null);
    }

    public List<Task> getAllTasks() {
        return tasks;
    }

    public void addHistory(Task task, String action, User user) {
        histories.add(History.builder().task(task).action(action).historyBy(user).build());
    }

    public List<History> getAllHistoryByTask(String taskId) {
        return histories.stream().filter(history -> history.getTask() != null && history.getTask().getId().equals(taskId)).toList();
    }

    public List<Task> filterByPriority(String priority) {
        return tasks.stream().filter(task -> priority.equalsIgnoreCase(task.getPrioritas())).toList();
    }

    public List<Task> filterByStatus(String status) {
        return tasks.stream().filter(task -> status.equalsIgnoreCase(task.getStatus())).toList();
    }

    public List<Task> filterByLabel(Label label) {
        return tasks.stream().filter(task -> task.getLabels() != null && task.getLabels().stream().anyMatch(item -> item.getId().equals(label.getId()))).toList();
    }

    public List<Task> sortByDeadline() {
        return tasks.stream().sorted(Comparator.comparing(Task::getDeadline, Comparator.nullsLast(Comparator.naturalOrder()))).toList();
    }

    public List<Task> sortByPriority() {
        return tasks.stream().sorted(Comparator.comparing(Task::getPrioritas, Comparator.nullsLast(Comparator.naturalOrder()))).toList();
    }
}
