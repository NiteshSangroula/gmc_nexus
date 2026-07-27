import api from "./axios";

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email, password, username, otp) => {
    const response = await api.post("/auth/register", { email, password, username, otp });
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

  upgradeToPremium: async () => {
    const response = await api.post("/user/premium");
    return response.data;
  },



  updateProfile: async (username, email) => {
    const response = await api.put("/user", { username, email });
    return response.data;
  },
};

export default authApi;
