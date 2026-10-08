package com.SamuelDevelop.studia;

import com.SamuelDevelop.studia.dto.auth.AuthResponse;
import com.SamuelDevelop.studia.dto.auth.LoginRequest;
import com.SamuelDevelop.studia.dto.auth.RegisterRequest;
import com.SamuelDevelop.studia.dto.ollama.OllamaStudyPayload;
import com.SamuelDevelop.studia.dto.study.GenerateStudyRequest;
import com.SamuelDevelop.studia.dto.study.StudyDetailResponse;
import com.SamuelDevelop.studia.dto.study.StudySummaryResponse;
import com.SamuelDevelop.studia.exception.UnauthorizedException;
import com.SamuelDevelop.studia.service.AiService;
import com.SamuelDevelop.studia.service.AuthService;
import com.SamuelDevelop.studia.service.StudyService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.UUID;

@SpringBootTest
class StudiaFlowTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private StudyService studyService;

    @MockitoBean
    private AiService aiService;

    @Test
    void testAuthenticationAndStudyFlow() {
        String emailA = "user_a_" + UUID.randomUUID() + "@test.com";
        String emailB = "user_b_" + UUID.randomUUID() + "@test.com";

        RegisterRequest regA = RegisterRequest.builder()
                .name("Aluno A")
                .email(emailA)
                .password("senha123")
                .build();
        AuthResponse resA = authService.register(regA);
        Assertions.assertNotNull(resA.getToken());
        Assertions.assertEquals("Aluno A", resA.getUser().getName());

        RegisterRequest regB = RegisterRequest.builder()
                .name("Aluno B")
                .email(emailB)
                .password("senha456")
                .build();
        AuthResponse resB = authService.register(regB);
        Assertions.assertNotNull(resB.getToken());

        AuthResponse loginA = authService.login(LoginRequest.builder().email(emailA).password("senha123").build());
        Assertions.assertNotNull(loginA.getToken());

        OllamaStudyPayload payload = OllamaStudyPayload.builder()
                .title("Estudo de Teste")
                .topic("Computação")
                .difficulty("Iniciante")
                .content(OllamaStudyPayload.ContentPayload.builder()
                        .introduction("Introdução didática ao tema.")
                        .sections(List.of(
                                OllamaStudyPayload.SectionPayload.builder()
                                        .title("Seção 1")
                                        .body("Conteúdo da seção 1")
                                        .build()
                        ))
                        .keyPoints(List.of("Ponto chave 1", "Ponto chave 2"))
                        .conclusion("Conclusão do estudo.")
                        .build())
                .flashcards(List.of(
                        OllamaStudyPayload.FlashcardPayload.builder()
                                .front("O que é bit?")
                                .back("Menor unidade de informação.")
                                .build()
                ))
                .quiz(List.of(
                        OllamaStudyPayload.QuizPayload.builder()
                                .question("Quantos bits há em 1 byte?")
                                .options(List.of("4", "8", "16", "32"))
                                .correctAnswer(1)
                                .explanation("Um byte é composto por 8 bits.")
                                .build()
                ))
                .build();

        Mockito.when(aiService.generateStudy(Mockito.any())).thenReturn(payload);

        GenerateStudyRequest generateRequest = GenerateStudyRequest.builder()
                .topic("Computação")
                .difficulty("Iniciante")
                .flashcardCount(1)
                .questionCount(1)
                .language("Português")
                .build();

        StudyDetailResponse createdStudy = studyService.generateStudy(generateRequest, emailA);
        Assertions.assertNotNull(createdStudy.getId());
        Assertions.assertEquals("Estudo de Teste", createdStudy.getTitle());
        Assertions.assertEquals(1, createdStudy.getFlashcards().size());
        Assertions.assertEquals(1, createdStudy.getQuiz().size());

        List<StudySummaryResponse> studiesA = studyService.listUserStudies(emailA);
        Assertions.assertFalse(studiesA.isEmpty());
        Assertions.assertEquals(createdStudy.getId(), studiesA.get(0).getId());

        List<StudySummaryResponse> studiesB = studyService.listUserStudies(emailB);
        Assertions.assertTrue(studiesB.isEmpty());

        Assertions.assertThrows(UnauthorizedException.class, () -> {
            studyService.getStudyById(createdStudy.getId(), emailB);
        });

        StudyDetailResponse retrieved = studyService.getStudyById(createdStudy.getId(), emailA);
        Assertions.assertEquals("Computação", retrieved.getTopic());

        studyService.deleteStudy(createdStudy.getId(), emailA);
        List<StudySummaryResponse> studiesAfterDelete = studyService.listUserStudies(emailA);
        Assertions.assertTrue(studiesAfterDelete.isEmpty());
    }
}

