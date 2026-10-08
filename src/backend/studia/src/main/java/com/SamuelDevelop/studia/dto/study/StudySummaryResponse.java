package com.SamuelDevelop.studia.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySummaryResponse {
    private UUID id;
    private String title;
    private String topic;
    private String difficulty;
    private String language;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

