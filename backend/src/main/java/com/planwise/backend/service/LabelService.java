package com.planwise.backend.service;

import com.planwise.backend.dto.LabelRequest;
import com.planwise.backend.entity.Label;
import com.planwise.backend.entity.Task;
import com.planwise.backend.repository.LabelRepository;
import com.planwise.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LabelService {
    private final LabelRepository labelRepository;
    private final TaskRepository taskRepository;

    public List<Label> getAllLabels() {
        return labelRepository.findAll();
    }

    public Label createLabel(LabelRequest request) {
        Label label = Label.builder()
                .id(UUID.randomUUID().toString())
                .nama(request.nama())
                .warna(request.warna() == null || request.warna().isBlank() ? "#996633" : request.warna())
                .build();
        return labelRepository.save(label);
    }

    @Transactional
    public void deleteLabel(String id) {
        Label label = labelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Label tidak ditemukan: " + id));
        List<Task> tasks = taskRepository.findByLabelId(id);
        for (Task task : tasks) {
            task.removeLabel(label);
            taskRepository.save(task);
        }
        labelRepository.delete(label);
    }
}
