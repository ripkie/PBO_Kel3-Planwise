package com.planwise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponseDTO {
    private String id;
    private String pesan;
    private String taskId;
    private boolean isRead;
}
