package com.planwise.backend.service;

import com.planwise.backend.dto.*;
import com.planwise.backend.entity.*;
import com.planwise.backend.enums.Priority;
import com.planwise.backend.enums.TaskStatus;
import com.planwise.backend.exception.BadRequestException;
import com.planwise.backend.exception.ResourceNotFoundException;
import com.planwise.backend.interfaces.Filterable;
import com.planwise.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService implements Filterable {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository;
    private final HistoryRepository historyRepository;

    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll().stream()
            .map(this::toDTO)
            .toList();
    }

    public TaskResponseDTO getTaskById(String id) {
        return toDTO(findTaskOrThrow(id));
    }

    public TaskResponseDTO createTask(TaskRequestDTO req) {
        String type = req.getTaskType() == null ? "PERSONAL" : req.getTaskType().toUpperCase();
        Task task = switch (type) {
            case "PERSONAL" -> buildPersonalTask(req);
            case "GROUP"    -> buildGroupTask(req);
            case "DEADLINE" -> buildDeadlineTask(req);
            default -> throw new BadRequestException("taskType tidak valid: " + type);
        };
        applyCommonFields(task, req);
        Task saved = taskRepository.save(task);
        return toDTO(saved);
    }

    public TaskResponseDTO updateTask(String id, TaskRequestDTO req) {
        Task task = findTaskOrThrow(id);
        if (req.getJudul() != null)     task.setJudul(req.getJudul());
        if (req.getDeskripsi() != null) task.setDeskripsi(req.getDeskripsi());
        if (req.getDeadline() != null)  task.setDeadline(req.getDeadline());
        if (req.getPrioritas() != null) task.setPrioritas(req.getPrioritas());
        if (req.getStatus() != null)    task.setStatus(req.getStatus());
        if (req.getLabelIds() != null)  task.setLabels(fetchLabels(req.getLabelIds()));
        return toDTO(taskRepository.save(task));
    }

    public TaskResponseDTO updateStatus(String id, UpdateStatusDTO dto) {
        Task task = findTaskOrThrow(id);
        task.setStatus(dto.getStatus());
        return toDTO(taskRepository.save(task));
    }

    public void deleteTask(String id) {
        if (!taskRepository.existsById(id))
            throw new ResourceNotFoundException("Task tidak ditemukan: " + id);
        taskRepository.deleteById(id);
    }

    public List<HistoryResponseDTO> getHistoryByTask(String taskId) {
        return historyRepository.findByTaskId(taskId).stream()
            .map(this::toHistoryDTO)
            .toList();
    }

    @Override
    public List<TaskResponseDTO> filterByLabel(Label label) {
        return taskRepository.findAll().stream()
            .filter(t -> t.getLabels().contains(label))
            .map(this::toDTO)
            .toList();
    }

    @Override
    public List<TaskResponseDTO> filterByPriority(Priority priority) {
        return taskRepository.findByPrioritas(priority).stream()
            .map(this::toDTO)
            .toList();
    }

    @Override
    public List<TaskResponseDTO> filterByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
            .map(this::toDTO)
            .toList();
    }

    // ── helpers ─────────────────────────────────────────────────────

    private Task findTaskOrThrow(String id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task tidak ditemukan: " + id));
    }

    private User findUserOrThrow(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan: " + id));
    }

    private List<Label> fetchLabels(List<String> ids) {
        return ids.stream().map(lid ->
            labelRepository.findById(lid)
                .orElseThrow(() -> new ResourceNotFoundException("Label tidak ditemukan: " + lid))
        ).toList();
    }

    private void applyCommonFields(Task task, TaskRequestDTO req) {
        task.setJudul(req.getJudul());
        task.setDeskripsi(req.getDeskripsi());
        task.setDeadline(req.getDeadline());
        if (req.getPrioritas() != null) task.setPrioritas(req.getPrioritas());
        if (req.getStatus() != null)    task.setStatus(req.getStatus());
        if (req.getLabelIds() != null)  task.setLabels(fetchLabels(req.getLabelIds()));
    }

    private PersonalTask buildPersonalTask(TaskRequestDTO req) {
        PersonalTask pt = new PersonalTask();
        if (req.getOwnerId() != null)
            pt.setOwner(findUserOrThrow(req.getOwnerId()));
        return pt;
    }

    private GroupTask buildGroupTask(TaskRequestDTO req) {
        GroupTask gt = new GroupTask();
        if (req.getMemberIds() != null)
            gt.setMembers(req.getMemberIds().stream().map(this::findUserOrThrow).toList());
        if (req.getAssignedToId() != null)
            gt.setAssignedTo(findUserOrThrow(req.getAssignedToId()));
        return gt;
    }

    private DeadlineTask buildDeadlineTask(TaskRequestDTO req) {
        return new DeadlineTask();
    }

    TaskResponseDTO toDTO(Task task) {
        TaskResponseDTO.TaskResponseDTOBuilder b = TaskResponseDTO.builder()
            .id(task.getId())
            .judul(task.getJudul())
            .deskripsi(task.getDeskripsi())
            .deadline(task.getDeadline())
            .status(task.getStatus())
            .prioritas(task.getPrioritas())
            .createdAt(task.getCreatedAt())
            .labels(task.getLabels().stream().map(l ->
                LabelDTO.builder().id(l.getId()).nama(l.getNama()).warna(l.getWarna()).build()
            ).toList());

        if (task instanceof PersonalTask pt) {
            b.taskType("PERSONAL");
            if (pt.getOwner() != null) b.owner(toUserSummary(pt.getOwner()));
        } else if (task instanceof GroupTask gt) {
            b.taskType("GROUP");
            b.members(gt.getMembers().stream().map(this::toUserSummary).toList());
            if (gt.getAssignedTo() != null) b.assignedTo(toUserSummary(gt.getAssignedTo()));
        } else if (task instanceof DeadlineTask dt) {
            b.taskType("DEADLINE");
            b.isOverdue(dt.checkOverdue());
        } else {
            b.taskType("TASK");
        }

        return b.build();
    }

    private UserSummaryDTO toUserSummary(User u) {
        return UserSummaryDTO.builder().id(u.getId()).nama(u.getNama()).email(u.getEmail()).build();
    }

    private HistoryResponseDTO toHistoryDTO(History h) {
        return HistoryResponseDTO.builder()
            .id(h.getId())
            .taskId(h.getTask().getId())
            .taskJudul(h.getTask().getJudul())
            .action(h.getAction())
            .historyAt(h.getHistoryAt())
            .historyBy(toUserSummary(h.getHistoryBy()))
            .build();
    }
}
