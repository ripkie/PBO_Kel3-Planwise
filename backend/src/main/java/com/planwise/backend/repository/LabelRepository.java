package com.planwise.backend.repository;

import com.planwise.backend.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabelRepository extends JpaRepository<Label, String> {}
