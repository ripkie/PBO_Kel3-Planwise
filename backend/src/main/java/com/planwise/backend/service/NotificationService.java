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

    // Mengirim notifikasi ke user (send)
    public Notification send(Task task, User user, String pesan) {
        Notification notif = Notification.builder()
                .id(UUID.randomUUID().toString())
                .task(task)
                .user(user)
                .pesan(pesan)
                .isRead(false)
                .build();
        return notificationRepository.save(notif);
    }

    // Menandai notifikasi sudah dibaca (markAsRead)
    public Notification markAsRead(String notifId) {
        Notification notif = notificationRepository.findById(notifId)
                .orElseThrow(() -> new RuntimeException("Notification tidak ditemukan: " + notifId));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    // Ambil semua notifikasi milik user
    public List<Notification> getByUser(String userId) {
        return notificationRepository.findByUserIdOrderByIdDesc(userId);
    }

    // Ambil notifikasi yang belum dibaca
    public List<Notification> getUnread(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    // getMessage (isi pesan notifikasi)
    public String getMessage(String notifId) {
        return notificationRepository.findById(notifId)
                .map(Notification::getPesan)
                .orElse("");
    }
    // Tandai semua sebagai sudah dibaca
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // Hapus satu notifikasi
    public void deleteNotification(String notifId) {
        notificationRepository.deleteById(notifId);
    }

    // Hapus semua notifikasi yang sudah dibaca milik user
    public void deleteReadNotifications(String userId) {
        notificationRepository.deleteByUserIdAndIsReadTrue(userId);
    }
}
