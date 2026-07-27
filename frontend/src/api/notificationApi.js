import api from "./axios";

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/mark-read");
    return response.data;
  },
};

export default notificationApi;
