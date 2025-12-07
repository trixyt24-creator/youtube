import { create } from "zustand";
import api from "../api/axiosConfig";
import { serverURL } from "../App";

export const useHistoryStore = create((set, get) => ({
  videoHistory: null,
  shortHistory: null,
  setVideoHistory: (history) => set({ history }),
  setShortHistory: (history) => set({ history }),
  getHistory: async () => {
    try {
      const res = await api.get(`${serverURL}/api/user/get-history`, {
        withCredentials: true,
      });
      const history = res.data;
      const videos = history.filter((item) => item.contentType === "Video");
      const shorts = history.filter((item) => item.contentType === "Short");
      set({ videoHistory: videos });
      set({ shortHistory: shorts });
      console.log({ videos, shorts });
    } catch (error) {
      console.log(error);
    }
  },
}));
