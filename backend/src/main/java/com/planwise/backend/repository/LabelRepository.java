package com.planwise.backend.repository;

import com.planwise.backend.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LabelRepository extends JpaRepository<Label, String> {
    Optional<Label> findByNamaIgnoreCase(String nama);
}
