package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {

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
    @JoinColumn(name = "manajemen_task_id")
    private ManajemenTask manajemenTask;
}