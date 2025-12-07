import { create } from "zustand";
import api from "../api/axiosConfig";
import { serverURL } from "../App";

export const useChannelStore = create((set, get) => ({
  channelData: null,
  allChannelsData: null,
  setChannelData: (data) => set({ channelData: data }),
  getUserChannel: async () => {
    try {
      const res = await api.get(`${serverURL}/api/user/get-channel`, {
        withCredentials: true,
      });
      set({ channelData: res.data });
      console.log(get().channelData);
    } catch (error) {
      console.log(error);
    }
  },
  setAllChannelsData: (data) => set({ allChannelsData: data }),
  getAllChannels: async () => {
    try {
      const res = await api.get(`${serverURL}/api/user/get-all-channels`, {
        withCredentials: true,
      });
      set({ allChannelsData: res.data });
      console.log(get().allChannelsData);
    } catch (error) {
      console.log(error);
    }
  },
}));
