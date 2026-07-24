import api from "./axios";

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email, password, username) => {
    const response = await api.post("/auth/register", { email, password, username });
    return response.data;
  },

  sendOtp: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/user");
    return response.data;
  },

  getUserCredits: async () => {
    const response = await api.get("/user/credits");
    return response.data;
  },
};

export default authApi;
