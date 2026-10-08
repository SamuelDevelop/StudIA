package com.SamuelDevelop.studia.dto.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OllamaStudyPayload {
    private String title;
    private String topic;
    private String difficulty;
    private ContentPayload content;
    @Builder.Default
    private List<FlashcardPayload> flashcards = new ArrayList<>();
    @Builder.Default
    private List<QuizPayload> quiz = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ContentPayload {
        private String introduction;
        @Builder.Default
        private List<SectionPayload> sections = new ArrayList<>();
        @Builder.Default
        private List<String> keyPoints = new ArrayList<>();
        private String conclusion;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SectionPayload {
        private String title;
        private String body;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FlashcardPayload {
        private String front;
        private String back;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuizPayload {
        private String question;
        @Builder.Default
        private List<String> options = new ArrayList<>();
        private Integer correctAnswer;
        private String explanation;
    }
}

