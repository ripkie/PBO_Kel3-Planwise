package com.planwise.backend.entity;

import com.planwise.backend.interfaces.Trackable;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Task implements Trackable {

    @Id
    private String id;

    @Column(nullable = false)
    private String judul;

    @Column(columnDefinition = "TEXT")
    private String deskripsi;

    private LocalDate deadline;

    private String status;

    private String prioritas;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "task_type")
    private String taskType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "management_task_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ManagementTask managementTask;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "task_labels",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    @Builder.Default
    private List<Label> labels = new ArrayList<>();

    public void changeStatus(String status) {
        this.status = status;
    }

    public void setDeadline(LocalDate date) {
        this.deadline = date;
    }

    public void setPriority(String priority) {
        this.prioritas = priority;
    }

    public void updateDeskripsi(String desc) {
        this.deskripsi = desc;
    }

    public void addLabel(Label label) {
        if (labels == null) {
            labels = new ArrayList<>();
        }
        boolean exists = labels.stream().anyMatch(item -> item.getId().equals(label.getId()));
        if (!exists) {
            labels.add(label);
        }
    }

    public void removeLabel(Label label) {
        if (labels != null) {
            labels.removeIf(item -> item.getId().equals(label.getId()));
        }
    }

    @Override
    public void updateStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return taskType;
    }
}
