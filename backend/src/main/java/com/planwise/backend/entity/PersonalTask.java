package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "personal_tasks")
@PrimaryKeyJoinColumn(name = "task_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PersonalTask extends Task {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
