package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private String action;

    @Column(name = "history_at", nullable = false)
    private Instant historyAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "history_by_user_id")
    private User historyBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manajemen_task_id")
    private ManajemenTask manajemenTask;
}
