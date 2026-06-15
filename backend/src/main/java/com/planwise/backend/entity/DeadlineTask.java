package com.planwise.backend.entity;

import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DeadlineTask extends Task {

    private Boolean isOverdue = false;

    public Boolean checkOverdue() {
        if (getDeadline() == null) {
            isOverdue = false;
        } else {
            isOverdue = getDeadline().isBefore(LocalDate.now());
        }
        return isOverdue;
    }

    @Override
    public String getType() {
        return "DEADLINE";
    }
}