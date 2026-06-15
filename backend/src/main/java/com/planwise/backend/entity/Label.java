package com.planwise.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "labels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Label {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String nama;

    @Column(nullable = false)
    private String warna;

    @ManyToMany(mappedBy = "labels")
    @JsonIgnore
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    public String getNama() {
        return nama;
    }
}
