package com.SamuelDevelop.studia.service;

import com.SamuelDevelop.studia.dto.ollama.OllamaStudyPayload;
import com.SamuelDevelop.studia.dto.study.GenerateStudyRequest;
import com.SamuelDevelop.studia.exception.AiGenerationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;

    public OllamaStudyPayload generateStudy(GenerateStudyRequest request) {
        String prompt = buildPrompt(request);
        Map<String, Object> jsonSchema = buildJsonSchema();

        String rawResponse = ollamaClient.generate(prompt, jsonSchema);
        return parseAndValidate(rawResponse, request);
    }

    private String buildPrompt(GenerateStudyRequest request) {
        return "Você é um assistente especializado em educação e criação de materiais de estudo.\n\n"
                + "Sua tarefa é criar um estudo completo sobre o tema fornecido pelo usuário.\n\n"
                + "Tema: " + request.getTopic() + "\n\n"
                + "Nível: " + request.getDifficulty() + "\n\n"
                + "Quantidade de flashcards: " + request.getFlashcardCount() + "\n\n"
                + "Quantidade de questões: " + request.getQuestionCount() + "\n\n"
                + "Idioma: " + request.getLanguage() + "\n\n"
                + "Crie um material didático claro, correto, organizado e adequado ao nível informado.\n\n"
                + "O estudo deve possuir três partes:\n\n"
                + "1. CONTEÚDO\n\n"
                + "Explique o tema de maneira didática.\n\n"
                + "O conteúdo deve possuir:\n\n"
                + "- Introdução\n"
                + "- Conceitos fundamentais\n"
                + "- Explicações detalhadas\n"
                + "- Exemplos práticos quando apropriado\n"
                + "- Pontos importantes para memorização\n"
                + "- Conclusão\n\n"
                + "Não invente informações.\n\n"
                + "Quando o tema possuir conceitos técnicos, diferencie claramente conceitos semelhantes e explique termos importantes.\n\n"
                + "2. FLASHCARDS\n\n"
                + "Crie flashcards para revisão.\n\n"
                + "Cada flashcard deve possuir:\n\n"
                + "- front: pergunta, conceito ou termo\n"
                + "- back: resposta objetiva e correta\n\n"
                + "Os flashcards devem priorizar informações importantes para a compreensão e memorização do tema.\n\n"
                + "Evite perguntas triviais ou redundantes.\n\n"
                + "3. QUESTIONÁRIO\n\n"
                + "Crie questões de múltipla escolha.\n\n"
                + "Cada questão deve possuir:\n\n"
                + "- question: enunciado\n"
                + "- options: exatamente 4 alternativas\n"
                + "- correctAnswer: índice da alternativa correta começando em 0\n"
                + "- explanation: explicação da resposta correta\n\n"
                + "As alternativas incorretas devem ser plausíveis e não devem ser absurdamente fáceis de eliminar.\n\n"
                + "As questões devem avaliar compreensão, não apenas memorização literal.\n\n"
                + "REGRAS IMPORTANTES:\n\n"
                + "- Responda exclusivamente em JSON válido.\n"
                + "- Não utilize Markdown.\n"
                + "- Não coloque texto antes ou depois do JSON.\n"
                + "- Não utilize blocos de código.\n"
                + "- Não inclua comentários no JSON.\n"
                + "- Respeite exatamente a quantidade solicitada de flashcards e questões.\n"
                + "- Não repita informações desnecessariamente.\n"
                + "- Mantenha o conteúdo adequado ao nível solicitado.\n"
                + "- O JSON deve ser válido e facilmente parseável por uma aplicação backend.\n\n"
                + "Utilize exatamente esta estrutura:\n\n"
                + "{\n"
                + "  \"title\": \"Título do estudo\",\n"
                + "  \"topic\": \"Tema\",\n"
                + "  \"difficulty\": \"Nível\",\n"
                + "  \"content\": {\n"
                + "    \"introduction\": \"Introdução\",\n"
                + "    \"sections\": [\n"
                + "      {\n"
                + "        \"title\": \"Título da seção\",\n"
                + "        \"body\": \"Conteúdo da seção\"\n"
                + "      }\n"
                + "    ],\n"
                + "    \"keyPoints\": [\n"
                + "      \"Ponto importante 1\",\n"
                + "      \"Ponto importante 2\"\n"
                + "    ],\n"
                + "    \"conclusion\": \"Conclusão\"\n"
                + "  },\n"
                + "  \"flashcards\": [\n"
                + "    {\n"
                + "      \"front\": \"Pergunta ou conceito\",\n"
                + "      \"back\": \"Resposta\"\n"
                + "    }\n"
                + "  ],\n"
                + "  \"quiz\": [\n"
                + "    {\n"
                + "      \"question\": \"Enunciado da questão\",\n"
                + "      \"options\": [\n"
                + "        \"Alternativa A\",\n"
                + "        \"Alternativa B\",\n"
                + "        \"Alternativa C\",\n"
                + "        \"Alternativa D\"\n"
                + "      ],\n"
                + "      \"correctAnswer\": 0,\n"
                + "      \"explanation\": \"Explicação da resposta correta\"\n"
                + "    }\n"
                + "  ]\n"
                + "}";
    }

    private Map<String, Object> buildJsonSchema() {
        Map<String, Object> sectionProps = new LinkedHashMap<>();
        sectionProps.put("title", Map.of("type", "string"));
        sectionProps.put("body", Map.of("type", "string"));

        Map<String, Object> sectionObj = new LinkedHashMap<>();
        sectionObj.put("type", "object");
        sectionObj.put("properties", sectionProps);
        sectionObj.put("required", List.of("title", "body"));

        Map<String, Object> contentProps = new LinkedHashMap<>();
        contentProps.put("introduction", Map.of("type", "string"));
        contentProps.put("sections", Map.of("type", "array", "items", sectionObj));
        contentProps.put("keyPoints", Map.of("type", "array", "items", Map.of("type", "string")));
        contentProps.put("conclusion", Map.of("type", "string"));

        Map<String, Object> contentObj = new LinkedHashMap<>();
        contentObj.put("type", "object");
        contentObj.put("properties", contentProps);
        contentObj.put("required", List.of("introduction", "sections", "keyPoints", "conclusion"));

        Map<String, Object> flashcardProps = new LinkedHashMap<>();
        flashcardProps.put("front", Map.of("type", "string"));
        flashcardProps.put("back", Map.of("type", "string"));

        Map<String, Object> flashcardObj = new LinkedHashMap<>();
        flashcardObj.put("type", "object");
        flashcardObj.put("properties", flashcardProps);
        flashcardObj.put("required", List.of("front", "back"));

        Map<String, Object> quizProps = new LinkedHashMap<>();
        quizProps.put("question", Map.of("type", "string"));
        quizProps.put("options", Map.of("type", "array", "items", Map.of("type", "string")));
        quizProps.put("correctAnswer", Map.of("type", "integer"));
        quizProps.put("explanation", Map.of("type", "string"));

        Map<String, Object> quizObj = new LinkedHashMap<>();
        quizObj.put("type", "object");
        quizObj.put("properties", quizProps);
        quizObj.put("required", List.of("question", "options", "correctAnswer", "explanation"));

        Map<String, Object> rootProps = new LinkedHashMap<>();
        rootProps.put("title", Map.of("type", "string"));
        rootProps.put("topic", Map.of("type", "string"));
        rootProps.put("difficulty", Map.of("type", "string"));
        rootProps.put("content", contentObj);
        rootProps.put("flashcards", Map.of("type", "array", "items", flashcardObj));
        rootProps.put("quiz", Map.of("type", "array", "items", quizObj));

        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", rootProps);
        schema.put("required", List.of("title", "topic", "difficulty", "content", "flashcards", "quiz"));

        return schema;
    }

    private OllamaStudyPayload parseAndValidate(String rawResponse, GenerateStudyRequest request) {
        String cleanJson = rawResponse.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }
        cleanJson = cleanJson.trim();

        OllamaStudyPayload payload;
        try {
            payload = objectMapper.readValue(cleanJson, OllamaStudyPayload.class);
        } catch (Exception ex) {
            throw new AiGenerationException("A resposta gerada pelo modelo local não possui um JSON válido.", ex);
        }

        if (payload == null) {
            throw new AiGenerationException("O estudo gerado está nulo.");
        }

        if (payload.getTitle() == null || payload.getTitle().isBlank()) {
            payload.setTitle("Estudo sobre " + request.getTopic());
        }
        if (payload.getTopic() == null || payload.getTopic().isBlank()) {
            payload.setTopic(request.getTopic());
        }
        if (payload.getDifficulty() == null || payload.getDifficulty().isBlank()) {
            payload.setDifficulty(request.getDifficulty());
        }

        if (payload.getContent() == null) {
            throw new AiGenerationException("A seção de conteúdo não foi incluída na resposta do modelo.");
        }

        if (payload.getContent().getIntroduction() == null || payload.getContent().getIntroduction().isBlank()) {
            throw new AiGenerationException("A introdução do estudo não foi fornecida.");
        }

        if (payload.getContent().getSections() == null || payload.getContent().getSections().isEmpty()) {
            throw new AiGenerationException("Nenhuma seção temática foi gerada pelo modelo.");
        }

        if (payload.getFlashcards() == null || payload.getFlashcards().isEmpty()) {
            throw new AiGenerationException("Nenhum flashcard foi gerado pelo modelo.");
        }

        if (payload.getQuiz() == null || payload.getQuiz().isEmpty()) {
            throw new AiGenerationException("Nenhuma questão de questionário foi gerada pelo modelo.");
        }

        for (OllamaStudyPayload.QuizPayload q : payload.getQuiz()) {
            if (q.getOptions() == null || q.getOptions().size() < 2) {
                throw new AiGenerationException("Questão sem opções suficientes gerada pela IA.");
            }
            if (q.getCorrectAnswer() == null || q.getCorrectAnswer() < 0 || q.getCorrectAnswer() >= q.getOptions().size()) {
                q.setCorrectAnswer(0);
            }
            if (q.getExplanation() == null) {
                q.setExplanation("");
            }
        }

        return payload;
    }
}

