package com.planwise.backend.repository;

import com.planwise.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserId(String userId);
    List<Notification> findByUserIdAndIsRead(String userId, boolean isRead);
}
