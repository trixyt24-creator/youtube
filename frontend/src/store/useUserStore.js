import { create } from "zustand";
import api from "../api/axiosConfig";
import { serverURL } from "../App";

export const useUserStore = create((set, get) => ({
  loggedInUserData: null,
  getCurrentLoggedInUser: async () => {
    try {
      const res = await api.get(`${serverURL}/api/user`, {
        withCredentials: true,
      });
      set({ loggedInUserData: res.data });
      console.log(get().loggedInUserData);
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      await api.post(`${serverURL}/api/auth/logout`, null, {
        withCredentials: true,
      });
      set({ loggedInUserData: null });
    } catch (error) {
      console.log(error);
    }
  },
  setLoggedInUserData: (user) => set({ loggedInUserData: user }),
}));
