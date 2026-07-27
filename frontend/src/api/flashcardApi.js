import api from "./axios";

export const flashcardApi = {
  // Generate flashcards from uploaded PDF document via Google Gemini AI
  generateFlashcards: async (pdfId, count = 10) => {
    const response = await api.post(`/cards/generate?pdfId=${pdfId}&count=${count}`);
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

  deleteDeck: async (deckId) => {
    const response = await api.delete(`/cards/deck/${deckId}`);
    return response.data;
  },

  getPublicFlashcards: async (page = 0, size = 50) => {
    const response = await api.get(`/cards/public?page=${page}&size=${size}`);
    return response.data;
  },

  // Reaction and replies endpoints for the forum
  getDeckInteractions: async (deckId) => {
    const response = await api.get(`/decks/${deckId}/interactions`);
    return response.data;
  },

  reactToDeck: async (deckId, isLike) => {
    const response = await api.post(`/decks/${deckId}/react?isLike=${isLike}`);
    return response.data;
  },

  getDeckReplies: async (deckId) => {
    const response = await api.get(`/decks/${deckId}/replies`);
    return response.data;
  },

  addDeckReply: async (deckId, message) => {
    const response = await api.post(`/decks/${deckId}/replies`, { message });
    return response.data;
  },
};

export default flashcardApi;
