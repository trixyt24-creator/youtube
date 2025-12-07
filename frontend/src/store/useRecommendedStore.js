import { create } from "zustand";
import api from "../api/axiosConfig";
import { serverURL } from "../App";

export const useRecommendedStore = create((set, get) => ({
  recommendedContent: null,
  getRecommendedContent: async () => {
    try {
      const res = await api.get(`${serverURL}/api/user/recommendations`, {
        withCredentials: true,
      });
      set({ recommendedContent: res.data });
      console.log(get().recommendedContent);
    } catch (error) {
      console.log(error);
    }
  },
  setRecommendedContent: (data) => set({ recommendedContent: data }),
}));
