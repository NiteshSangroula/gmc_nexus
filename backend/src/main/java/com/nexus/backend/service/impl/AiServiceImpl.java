package com.nexus.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.backend.dto.response.QAPairs;
import com.nexus.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {
    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public AiServiceImpl(
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.api.key}") String apiKey) {
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl + "?key=" + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

    }

    @Override
    public List<QAPairs> generateFlashCards(String text, int count) {
        String cappedText = text.substring(0, Math.min(text.length(), 8000));

        String prompt = "Generate a set of exactly " + count + " educational flashcards from the following text. "
                    + "Create clear, concise questions and answers covering the key concepts. "
                    + "Return a JSON array of objects, each containing 'question' and 'answer' fields. "
                    + "Input Text:\n\n" + cappedText;
        
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "responseSchema", Map.of(
                                "type", "ARRAY",
                                "items", Map.of(
                                        "type", "OBJECT",
                                        "properties", Map.of(
                                                "question", Map.of("type", "STRING"),
                                                "answer", Map.of("type", "STRING")),
                                        "required", List.of("question", "answer")))));
        try {
            String respondBody = restClient.post()
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);
            JsonNode rootNode = objectMapper.readTree(respondBody);
            String rawJsonText = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            return objectMapper.readValue(rawJsonText, new TypeReference<List<QAPairs>>() {
            });

        } catch (Exception e) {
            System.err.println("Gemini API error: " + e.getMessage());
            e.printStackTrace();
            return getFallbackFlashcards();
        }
    }

    private List<QAPairs> getFallbackFlashcards() {
        return List.of(
                new QAPairs(
                        "What is the primary goal of the AI study Platflorm?",
                        "To Convert uploaded PDF study note into interactive Q&A flashcards for efficient learning."),
                new QAPairs(
                        "How does the daily credit system work for FREE users?",
                        "FREE users receive a limited quota of 3 flashcard generations per day, which resets daily."),
                new QAPairs(
                        "What are the benefits of upgrading to the PREMIUM plan?",
                        "PREMIUM users receive unlimited flashcard generations and get access to advanced features."));

    }

}
