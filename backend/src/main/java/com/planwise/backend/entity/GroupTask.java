package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupTask extends Task {

    @ManyToMany
    @JoinTable(
            name = "group_task_members",
            joinColumns = @JoinColumn(name = "group_task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    public void addMember(User user) {
        if (members == null) {
            members = new ArrayList<>();
        }
        members.add(user);
    }

    public void assignTo(User user) {
        this.assignedTo = user;
    }

    @Override
    public String getType() {
        return "GROUP";
    }
}