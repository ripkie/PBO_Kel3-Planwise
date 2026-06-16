package com.planwise.backend.controller;

import com.planwise.backend.entity.Notification;
import com.planwise.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications/user/{userId} - semua notif user login
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(
                notificationService.getByUser(userId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    // GET /api/notifications/user/{userId}/unread - notif user yang belum dibaca
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Map<String, Object>>> getUnread(@PathVariable String userId) {
        return ResponseEntity.ok(
                notificationService.getUnread(userId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    // PATCH /api/notifications/{id}/read - tandai satu notif sebagai dibaca
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(toResponse(notificationService.markAsRead(id)));
    }

    // PATCH /api/notifications/user/{userId}/read-all - tandai semua notif user sebagai dibaca
    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOne(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/notifications/user/{userId}/read - hapus semua notif yang sudah dibaca milik user
    @DeleteMapping("/user/{userId}/read")
    public ResponseEntity<Void> deleteRead(@PathVariable String userId) {
        notificationService.deleteReadNotifications(userId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint global untuk debug Postman saja
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(
                notificationService.getAll()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    // Endpoint global untuk debug Postman saja
    @GetMapping("/unread")
    public ResponseEntity<List<Map<String, Object>>> getAllUnread() {
        return ResponseEntity.ok(
                notificationService.getAllUnread()
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @GetMapping("/{id}/message")
    public ResponseEntity<String> getMessage(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.getMessage(id));
    }

    private Map<String, Object> toResponse(Notification notif) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", notif.getId());
        response.put("pesan", notif.getPesan());
        response.put("isRead", notif.isRead());

        if (notif.getTask() != null) {
            Map<String, Object> task = new LinkedHashMap<>();
            task.put("id", notif.getTask().getId());
            task.put("judul", notif.getTask().getJudul());
            task.put("status", notif.getTask().getStatus());
            task.put("prioritas", notif.getTask().getPrioritas());
            response.put("task", task);
        } else {
            response.put("task", null);
        }

        if (notif.getUser() != null) {
            Map<String, Object> user = new LinkedHashMap<>();
            user.put("id", notif.getUser().getId());
            user.put("nama", notif.getUser().getNama());
            user.put("email", notif.getUser().getEmail());
            response.put("user", user);
        } else {
            response.put("user", null);
        }

        return response;
    }
}
