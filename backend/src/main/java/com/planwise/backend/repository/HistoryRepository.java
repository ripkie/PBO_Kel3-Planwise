package com.planwise.backend.repository;

import com.planwise.backend.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, String> {
    List<History> findByTaskIdOrderByHistoryAtDesc(String taskId);
    List<History> findByManagementTaskIdOrderByHistoryAtDesc(String managementTaskId);
    List<History> findAllByOrderByHistoryAtDesc();

    @Query("""
            SELECT DISTINCT h FROM History h
            LEFT JOIN FETCH h.task t
            LEFT JOIN FETCH t.owner o
            LEFT JOIN FETCH h.historyBy hb
            WHERE o.id = :userId OR hb.id = :userId
            ORDER BY h.historyAt DESC
            """)
    List<History> findMyHistory(@Param("userId") String userId);
}