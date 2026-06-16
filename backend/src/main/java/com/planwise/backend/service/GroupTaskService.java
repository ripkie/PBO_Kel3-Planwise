package com.planwise.backend.service;

import com.planwise.backend.entity.GroupTask;
import com.planwise.backend.entity.User;
import com.planwise.backend.repository.GroupTaskRepository;
import com.planwise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupTaskService {

    private final GroupTaskRepository groupTaskRepository;
    private final UserRepository userRepository;

    @Transactional
    public GroupTask addMember(String taskId, String userId) {
        GroupTask groupTask = groupTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Group task tidak ditemukan: " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan: " + userId));

        groupTask.addMember(user);

        return groupTaskRepository.save(groupTask);
    }

    @Transactional
    public GroupTask assignTo(String taskId, String userId) {
        GroupTask groupTask = groupTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Group task tidak ditemukan: " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan: " + userId));

        groupTask.assignTo(user);

        return groupTaskRepository.save(groupTask);
    }

    @Transactional(readOnly = true)
    public GroupTask getGroupTask(String taskId) {
        return groupTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Group task tidak ditemukan: " + taskId));
    }

    @Transactional
    public GroupTask createGroupTask(GroupTask groupTask) {
        if (groupTask.getId() == null || groupTask.getId().isBlank()) {
            groupTask.setId(java.util.UUID.randomUUID().toString());
        }

        groupTask.setTaskType("GROUP");

        return groupTaskRepository.save(groupTask);
    }
}