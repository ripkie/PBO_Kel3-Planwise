package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manajemen_tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ManajemenTask {

    @Id
    private String id;

    private String nama;
}