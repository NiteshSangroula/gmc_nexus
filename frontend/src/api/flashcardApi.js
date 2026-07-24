import api from "./axios";

export const flashcardApi = {
  // Generate flashcards from uploaded PDF document via Google Gemini AI
  generateFlashcards: async (pdfId) => {
    const response = await api.post(`/cards/generate?pdfId=${pdfId}?`);
    return response.data;
  },

  getFlashcards: async (page = 0, size = 50) => {
    const response = await api.get(`/cards?page=${page}&size=${size}`);
    return response.data;
  },

  getFlashcardById: async (id) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  createFlashcard: async (cardData) => {
    const response = await api.post("/cards", cardData);
    return response.data;
  },

  updateFlashcard: async (id, cardData) => {
    const response = await api.put(`/cards/${id}`, cardData);
    return response.data;
  },

  deleteFlashcard: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },
};

export default flashcardApi;
