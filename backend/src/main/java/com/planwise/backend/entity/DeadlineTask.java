package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deadline_tasks")
@PrimaryKeyJoinColumn(name = "task_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DeadlineTask extends Task {

    @Column(nullable = false)
    private boolean isOverdue = false;

    public boolean checkOverdue() {
        if (getDeadline() == null) return false;
        isOverdue = getDeadline().isBefore(java.time.LocalDate.now());
        return isOverdue;
    }
}
