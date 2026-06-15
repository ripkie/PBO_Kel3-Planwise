package com.planwise.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record TaskRequest(
        String judul,
        String deskripsi,
        LocalDate deadline,
        String status,
        String prioritas,
        String taskType,
        List<String> labelIds
) {}
