package com.planwise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistoryResponseDTO {
    private String id;
    private String taskId;
    private String taskJudul;
    private String action;
    private LocalDateTime historyAt;
    private UserSummaryDTO historyBy;
}
