package com.planwise.backend.entity;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PersonalTask extends Task {

    private String owner;

    @Override
    public String getType() {
        return "PERSONAL";
    }
}