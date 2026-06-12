package com.planwise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "labels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Label {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nama;

    @Column(nullable = false)
    private String warna;
}
