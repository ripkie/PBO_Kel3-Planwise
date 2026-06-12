package com.planwise.backend.entity;

import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String judul;

    @Column(columnDefinition = "TEXT")
    private String deskripsi;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority prioritas = Priority.MEDIUM;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_labels",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    @Builder.Default
    private List<Label> labels = new ArrayList<>();
}
