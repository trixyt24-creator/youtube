import { create } from "zustand";
import api from "../api/axiosConfig";
import { serverURL } from "../App";

export const useContentStore = create((set, get) => ({
  videos: null,
  shorts: null,
  setVideos: (data) => set({ videos: data }),
  setShorts: (data) => set({ shorts: data }),
  getAllVideos: async () => {
    try {
      const res = await api.get(`${serverURL}/api/content/getAllVideos`, {
        withCredentials: true,
      });
      set({ videos: res.data });
      console.log(get().videos);
    } catch (error) {
      console.log(error);
    }
  },
  getAllShorts: async () => {
    try {
      const res = await api.get(`${serverURL}/api/content/getAllShorts`, {
        withCredentials: true,
      });
      set({ shorts: res.data });
      console.log(get().shorts);
    } catch (error) {
      console.log(error);
    }
  },
}));
