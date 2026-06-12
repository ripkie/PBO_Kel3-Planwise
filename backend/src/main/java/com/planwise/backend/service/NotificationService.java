package com.planwise.backend.service;

import com.planwise.backend.dto.NotificationResponseDTO;
import com.planwise.backend.entity.Notification;
import com.planwise.backend.exception.ResourceNotFoundException;
import com.planwise.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationResponseDTO> getByUser(String userId) {
        return notificationRepository.findByUserId(userId).stream()
            .map(this::toDTO).toList();
    }

    public List<NotificationResponseDTO> getUnreadByUser(String userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false).stream()
            .map(this::toDTO).toList();
    }

    public NotificationResponseDTO markAsRead(String id) {
        Notification n = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notifikasi tidak ditemukan: " + id));
        n.setRead(true);
        return toDTO(notificationRepository.save(n));
    }

    private NotificationResponseDTO toDTO(Notification n) {
        return NotificationResponseDTO.builder()
            .id(n.getId())
            .pesan(n.getPesan())
            .taskId(n.getTask() != null ? n.getTask().getId() : null)
            .isRead(n.isRead())
            .build();
    }
}
