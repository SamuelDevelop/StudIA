package com.SamuelDevelop.studia.service;

import com.SamuelDevelop.studia.dto.ollama.OllamaGenerateRequest;
import com.SamuelDevelop.studia.dto.ollama.OllamaGenerateResponse;
import com.SamuelDevelop.studia.exception.AiGenerationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;

@Component
public class OllamaClient {

    private final RestClient restClient;
    private final String model;

    public OllamaClient(
            RestClient.Builder restClientBuilder,
            @Value("${ollama.base-url}") String baseUrl,
            @Value("${ollama.model}") String model
    ) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(15));
        requestFactory.setReadTimeout(Duration.ofSeconds(180));

        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
        this.model = model;
    }

    public String generate(String prompt, Object jsonSchema) {
        OllamaGenerateRequest request = OllamaGenerateRequest.builder()
                .model(this.model)
                .prompt(prompt)
                .stream(false)
                .format(jsonSchema)
                .build();

        try {
            OllamaGenerateResponse response = restClient.post()
                    .uri("/api/generate")
                    .body(request)
                    .retrieve()
                    .body(OllamaGenerateResponse.class);

            if (response == null || response.getResponse() == null || response.getResponse().isBlank()) {
                throw new AiGenerationException("Ollama retornou uma resposta vazia.");
            }

            return response.getResponse();
        } catch (ResourceAccessException ex) {
            throw new AiGenerationException("Não foi possível conectar ao Ollama local. Certifique-se de que o serviço está em execução.", ex);
        } catch (RestClientResponseException ex) {
            throw new AiGenerationException("Erro ao comunicar com o Ollama: " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            if (ex instanceof AiGenerationException) {
                throw (AiGenerationException) ex;
            }
            throw new AiGenerationException("Falha inesperada durante a geração com a IA local.", ex);
        }
    }
}

