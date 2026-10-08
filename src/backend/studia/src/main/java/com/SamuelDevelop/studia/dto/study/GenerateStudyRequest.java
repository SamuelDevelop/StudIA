package com.SamuelDevelop.studia.dto.study;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateStudyRequest {

    @NotBlank(message = "O tema do estudo é obrigatório")
    private String topic;

    @Builder.Default
    private String difficulty = "Iniciante";

    @Min(value = 1, message = "A quantidade de flashcards deve ser no mínimo 1")
    @Max(value = 20, message = "A quantidade de flashcards deve ser no máximo 20")
    @Builder.Default
    private Integer flashcardCount = 4;

    @Min(value = 1, message = "A quantidade de questões deve ser no mínimo 1")
    @Max(value = 20, message = "A quantidade de questões deve ser no máximo 20")
    @Builder.Default
    private Integer questionCount = 4;

    @Builder.Default
    private String language = "Português";
}

