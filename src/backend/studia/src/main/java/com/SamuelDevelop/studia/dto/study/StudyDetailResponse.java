package com.SamuelDevelop.studia.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyDetailResponse {
    private UUID id;
    private String title;
    private String topic;
    private String difficulty;
    private String language;
    private StudyContentDto content;
    @Builder.Default
    private List<FlashcardDto> flashcards = new ArrayList<>();
    @Builder.Default
    private List<QuizQuestionDto> quiz = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

