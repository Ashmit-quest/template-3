import { create } from "zustand";
import { API_URL } from "@/config";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  location: string;
  bio: string;
}

interface StoreState {
  user: UserProfile | null;
  campaigns: any[];
  fetchUser: () => Promise<void>;
  fetchCampaigns: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  campaigns: [],
  fetchUser: async () => {
    try {
      const res = await fetch(`${API_URL}/api/user`);
      const data = await res.json();
      set({ user: data });
    } catch (e) {
      console.error(e);
    }
  },
  fetchCampaigns: async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaigns`);
      const data = await res.json();
      set({ campaigns: data });
    } catch (e) {
      console.error(e);
    }
  },
  updateUser: async (data) => {
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      set({ user: updated });
    } catch (e) {
      console.error(e);
    }
  },
}));
