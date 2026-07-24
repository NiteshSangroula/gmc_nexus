package com.nexus.backend.service;

import com.nexus.backend.dto.response.QAPairs;
import java.util.List;

public interface AiService {
    List<QAPairs> generateFlashCards(String text);
}
