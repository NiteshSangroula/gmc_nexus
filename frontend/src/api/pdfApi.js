import api from "./axios";

export const pdfApi = {
  getAllPdfs: async () => {
    const response = await api.get("/pdf");
    return response.data;
  },

  getPdfById: async (id) => {
    const response = await api.get(`/pdf/${id}`);
    return response.data;
  },

  uploadPdf: async (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options.cardCount) formData.append("cardCount", options.cardCount);
    if (options.difficulty) formData.append("difficulty", options.difficulty);
    if (options.focus) formData.append("focus", options.focus);

    const response = await api.post("/pdf/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePdf: async (id) => {
    const response = await api.delete(`/pdf/${id}`);
    return response.data;
  },
};

export default pdfApi;
