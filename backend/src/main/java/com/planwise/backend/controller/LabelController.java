package com.planwise.backend.controller;

import com.planwise.backend.dto.LabelRequest;
import com.planwise.backend.entity.Label;
import com.planwise.backend.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/labels")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LabelController {
    private final LabelService labelService;

    @GetMapping
    public ResponseEntity<List<Label>> getLabels() {
        return ResponseEntity.ok(labelService.getAllLabels());
    }

    @PostMapping
    public ResponseEntity<Label> createLabel(@RequestBody LabelRequest request) {
        return ResponseEntity.ok(labelService.createLabel(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable String id) {
        labelService.deleteLabel(id);
        return ResponseEntity.noContent().build();
    }
}
