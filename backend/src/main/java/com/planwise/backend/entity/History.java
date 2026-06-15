package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "histories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class History {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(nullable = false)
    private String action;

    @Column(name = "history_at", nullable = false)
    private Instant historyAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "history_by_user_id")
    private User historyBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "management_task_id")
    private ManagementTask managementTask;
}
