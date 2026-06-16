package com.planwise.backend.repository;

import com.planwise.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, String> {
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels WHERE LOWER(t.status) = LOWER(:status)")
    List<Task> findByStatusIgnoreCase(@Param("status") String status);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels WHERE LOWER(t.prioritas) = LOWER(:prioritas)")
    List<Task> findByPrioritasIgnoreCase(@Param("prioritas") String prioritas);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels")
    List<Task> findAllWithLabels();

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels WHERE t.id = :id")
    Optional<Task> findWithLabelsById(@Param("id") String id);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels l WHERE l.id = :labelId")
    List<Task> findByLabelId(@Param("labelId") String labelId);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.labels WHERE t.owner.id = :userId")
    List<Task> findByOwnerIdWithLabels(@Param("userId") String userId);
}
