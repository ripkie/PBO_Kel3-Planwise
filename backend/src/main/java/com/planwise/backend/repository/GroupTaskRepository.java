package com.planwise.backend.repository;

import com.planwise.backend.entity.GroupTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupTaskRepository extends JpaRepository<GroupTask, String> {
}