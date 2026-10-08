package com.SamuelDevelop.studia.controller;

import com.SamuelDevelop.studia.dto.study.GenerateStudyRequest;
import com.SamuelDevelop.studia.dto.study.StudyDetailResponse;
import com.SamuelDevelop.studia.dto.study.StudySummaryResponse;
import com.SamuelDevelop.studia.service.StudyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/studies")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;

    @GetMapping
    public ResponseEntity<List<StudySummaryResponse>> listStudies(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<StudySummaryResponse> studies = studyService.listUserStudies(userDetails.getUsername());
        return ResponseEntity.ok(studies);
    }

    @PostMapping("/generate")
    public ResponseEntity<StudyDetailResponse> generateStudy(
            @Valid @RequestBody GenerateStudyRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        StudyDetailResponse study = studyService.generateStudy(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(study);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyDetailResponse> getStudy(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        StudyDetailResponse study = studyService.getStudyById(id, userDetails.getUsername());
        return ResponseEntity.ok(study);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudy(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        studyService.deleteStudy(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Estudo excluído com sucesso"));
    }
}

