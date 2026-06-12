package com.planwise.backend.repository;

import com.planwise.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserIdOrderByIdDesc(String userId);
    List<Notification> findByUserIdAndIsReadFalse(String userId);
    void deleteByUserIdAndIsReadTrue(String userId);
}
