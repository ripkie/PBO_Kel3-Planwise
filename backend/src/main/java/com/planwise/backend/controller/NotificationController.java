package com.planwise.backend.controller;

import com.planwise.backend.entity.Notification;
import com.planwise.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications/user/{userId} - semua notif user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getByUser(userId));
    }

    // GET /api/notifications/user/{userId}/unread - notif belum dibaca
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnread(userId));
    }

    // PATCH /api/notifications/{id}/read - tandai sudah dibaca
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
    // PATCH /api/notifications/user/{userId}/read-all
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

    // DELETE /api/notifications/user/{userId}/read
    @DeleteMapping("/user/{userId}/read")
    public ResponseEntity<Void> deleteRead(@PathVariable String userId) {
        notificationService.deleteReadNotifications(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(notificationService.getAll());
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getAllUnread() {
        return ResponseEntity.ok(notificationService.getAllUnread());
    }

    @GetMapping("/{id}/message")
    public ResponseEntity<String> getMessage(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.getMessage(id));
    }
}