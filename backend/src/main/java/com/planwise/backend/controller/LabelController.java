package com.planwise.backend.controller;

import com.planwise.backend.dto.LabelDTO;
import com.planwise.backend.service.LabelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping
    public ResponseEntity<List<LabelDTO>> getAllLabels() {
        return ResponseEntity.ok(labelService.getAllLabels());
    }

    @PostMapping
    public ResponseEntity<LabelDTO> createLabel(@Valid @RequestBody LabelDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labelService.createLabel(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable String id) {
        labelService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }
}
