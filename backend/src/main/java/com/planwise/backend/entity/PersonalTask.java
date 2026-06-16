package com.planwise.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonalTask extends Task {

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Override
    public String getType() {
        return "PERSONAL";
    }
}