package com.planwise.backend.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class GroupTask extends Task {

    @ElementCollection
    private List<String> members = new ArrayList<>();

    public void addMember(String member) {
        if (members == null) {
            members = new ArrayList<>();
        }
        members.add(member);
    }

    @Override
    public String getType() {
        return "GROUP";
    }
}