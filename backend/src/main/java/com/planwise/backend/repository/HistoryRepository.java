package com.planwise.backend.repository;

import com.planwise.backend.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, String> {
    List<History> findByTaskIdOrderByHistoryAtDesc(String taskId);
    List<History> findByManagementTaskIdOrderByHistoryAtDesc(String managementTaskId);
}