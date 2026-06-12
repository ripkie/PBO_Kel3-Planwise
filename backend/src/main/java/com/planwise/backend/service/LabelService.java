package com.planwise.backend.service;

import com.planwise.backend.dto.LabelDTO;
import com.planwise.backend.entity.Label;
import com.planwise.backend.exception.ResourceNotFoundException;
import com.planwise.backend.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;

    public List<LabelDTO> getAllLabels() {
        return labelRepository.findAll().stream().map(this::toDTO).toList();
    }

    public LabelDTO createLabel(LabelDTO req) {
        Label label = Label.builder().nama(req.getNama()).warna(req.getWarna()).build();
        return toDTO(labelRepository.save(label));
    }

    public void deleteLabel(String id) {
        if (!labelRepository.existsById(id))
            throw new ResourceNotFoundException("Label tidak ditemukan: " + id);
        labelRepository.deleteById(id);
    }

    private LabelDTO toDTO(Label l) {
        return LabelDTO.builder().id(l.getId()).nama(l.getNama()).warna(l.getWarna()).build();
    }
}
