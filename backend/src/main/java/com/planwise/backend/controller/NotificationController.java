package com.planwise.backend.controller;

import com.planwise.backend.dto.NotificationResponseDTO;
import com.planwise.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** GET /api/notifications?userId=xxx */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getByUser(
        @RequestParam String userId,
        @RequestParam(required = false) Boolean unreadOnly
    ) {
        List<NotificationResponseDTO> result = Boolean.TRUE.equals(unreadOnly)
            ? notificationService.getUnreadByUser(userId)
            : notificationService.getByUser(userId);
        return ResponseEntity.ok(result);
    }

    /** PATCH /api/notifications/{id}/read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
