package com.SamuelDevelop.studia.service;

import com.SamuelDevelop.studia.dto.ollama.OllamaStudyPayload;
import com.SamuelDevelop.studia.dto.study.*;
import com.SamuelDevelop.studia.entity.*;
import com.SamuelDevelop.studia.exception.ResourceNotFoundException;
import com.SamuelDevelop.studia.exception.UnauthorizedException;
import com.SamuelDevelop.studia.repository.StudyRepository;
import com.SamuelDevelop.studia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    @Transactional
    public StudyDetailResponse generateStudy(GenerateStudyRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        OllamaStudyPayload payload = aiService.generateStudy(request);

        Study study = Study.builder()
                .user(user)
                .title(payload.getTitle())
                .topic(payload.getTopic())
                .difficulty(payload.getDifficulty())
                .language(request.getLanguage() != null ? request.getLanguage() : "Português")
                .flashcards(new ArrayList<>())
                .quiz(new ArrayList<>())
                .build();

        StudyContent content = StudyContent.builder()
                .study(study)
                .introduction(payload.getContent().getIntroduction())
                .conclusion(payload.getContent().getConclusion())
                .keyPoints(new ArrayList<>(payload.getContent().getKeyPoints()))
                .sections(new ArrayList<>())
                .build();

        if (payload.getContent().getSections() != null) {
            int sectionIndex = 0;
            for (OllamaStudyPayload.SectionPayload sp : payload.getContent().getSections()) {
                StudySection section = StudySection.builder()
                        .content(content)
                        .title(sp.getTitle())
                        .body(sp.getBody())
                        .orderIndex(sectionIndex++)
                        .build();
                content.getSections().add(section);
            }
        }
        study.setContent(content);

        if (payload.getFlashcards() != null) {
            int cardIndex = 0;
            for (OllamaStudyPayload.FlashcardPayload fp : payload.getFlashcards()) {
                Flashcard flashcard = Flashcard.builder()
                        .study(study)
                        .front(fp.getFront())
                        .back(fp.getBack())
                        .orderIndex(cardIndex++)
                        .build();
                study.getFlashcards().add(flashcard);
            }
        }

        if (payload.getQuiz() != null) {
            int qIndex = 0;
            for (OllamaStudyPayload.QuizPayload qp : payload.getQuiz()) {
                QuizQuestion question = QuizQuestion.builder()
                        .study(study)
                        .question(qp.getQuestion())
                        .options(new ArrayList<>(qp.getOptions()))
                        .correctAnswer(qp.getCorrectAnswer())
                        .explanation(qp.getExplanation())
                        .orderIndex(qIndex++)
                        .build();
                study.getQuiz().add(question);
            }
        }

        Study savedStudy = studyRepository.saveAndFlush(study);
        if (savedStudy.getCreatedAt() == null) {
            savedStudy.setCreatedAt(java.time.LocalDateTime.now());
            savedStudy.setUpdatedAt(java.time.LocalDateTime.now());
        }
        return toDetailResponse(savedStudy);
    }

    @Transactional(readOnly = true)
    public List<StudySummaryResponse> listUserStudies(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return studyRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudyDetailResponse getStudyById(UUID id, String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Study study = studyRepository.findByIdAndUserId(id, user.getId())
                .orElseGet(() -> {
                    if (studyRepository.existsById(id)) {
                        throw new UnauthorizedException("Acesso negado a este estudo.");
                    }
                    throw new ResourceNotFoundException("Estudo não encontrado.");
                });

        return toDetailResponse(study);
    }

    @Transactional
    public void deleteStudy(UUID id, String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Study study = studyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo não encontrado."));

        if (!study.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Acesso negado para excluir este estudo.");
        }

        studyRepository.delete(study);
    }

    private StudySummaryResponse toSummaryResponse(Study study) {
        return StudySummaryResponse.builder()
                .id(study.getId())
                .title(study.getTitle())
                .topic(study.getTopic())
                .difficulty(study.getDifficulty())
                .language(study.getLanguage())
                .createdAt(study.getCreatedAt())
                .updatedAt(study.getUpdatedAt())
                .build();
    }

    private StudyDetailResponse toDetailResponse(Study study) {
        StudyContentDto contentDto = null;
        if (study.getContent() != null) {
            List<StudySectionDto> sectionDtos = study.getContent().getSections().stream()
                    .map(s -> StudySectionDto.builder()
                            .id(s.getId())
                            .title(s.getTitle())
                            .body(s.getBody())
                            .build())
                    .collect(Collectors.toList());

            contentDto = StudyContentDto.builder()
                    .introduction(study.getContent().getIntroduction())
                    .sections(sectionDtos)
                    .keyPoints(new ArrayList<>(study.getContent().getKeyPoints()))
                    .conclusion(study.getContent().getConclusion())
                    .build();
        }

        List<FlashcardDto> flashcardDtos = study.getFlashcards().stream()
                .map(f -> FlashcardDto.builder()
                        .id(f.getId())
                        .front(f.getFront())
                        .back(f.getBack())
                        .build())
                .collect(Collectors.toList());

        List<QuizQuestionDto> quizDtos = study.getQuiz().stream()
                .map(q -> QuizQuestionDto.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .options(new ArrayList<>(q.getOptions()))
                        .correctAnswer(q.getCorrectAnswer())
                        .explanation(q.getExplanation())
                        .build())
                .collect(Collectors.toList());

        return StudyDetailResponse.builder()
                .id(study.getId())
                .title(study.getTitle())
                .topic(study.getTopic())
                .difficulty(study.getDifficulty())
                .language(study.getLanguage())
                .content(contentDto)
                .flashcards(flashcardDtos)
                .quiz(quizDtos)
                .createdAt(study.getCreatedAt())
                .updatedAt(study.getUpdatedAt())
                .build();
    }
}
