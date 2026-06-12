package com.planwise.backend.service;

import com.planwise.backend.entity.*;
import com.planwise.backend.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    // Mencatat aktivitas task (historyTask)
    public History historyTask(Task task, String action, User doneBy) {
        History history = History.builder()
                .id(UUID.randomUUID().toString())
                .task(task)
                .action(action)
                .historyAt(Instant.now())
                .historyBy(doneBy)
                .manajemenTask(task.getManajemenTask())
                .build();
        return historyRepository.save(history);
    }

    // Menampilkan riwayat berdasarkan task tertentu
    public List<History> getHistoryByTask(String taskId) {
        return historyRepository.findByTaskIdOrderByHistoryAtDesc(taskId);
    }

    // Mengurutkan riwayat aktivitas task (sudah desc dari repo)
    public List<History> sortingHistory(String taskId) {
        return historyRepository.findByTaskIdOrderByHistoryAtDesc(taskId);
    }

    // Mendapatkan semua riwayat
    public List<History> getHistoryList() {
        return historyRepository.findAll();
    }
}
