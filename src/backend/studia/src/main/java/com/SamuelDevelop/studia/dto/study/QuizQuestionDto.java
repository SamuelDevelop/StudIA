package com.SamuelDevelop.studia.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {
    private UUID id;
    private String question;
    @Builder.Default
    private List<String> options = new ArrayList<>();
    private Integer correctAnswer;
    private String explanation;
}

