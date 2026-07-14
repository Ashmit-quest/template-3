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
  token: string | null;
  fetchUser: () => Promise<void>;
  fetchCampaigns: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  campaigns: [],
  token: localStorage.getItem("token"),
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
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem("token", data.token);
      set({ token: data.token });
      await get().fetchUser();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  signup: async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem("token", data.token);
      set({ token: data.token });
      await get().fetchUser();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  }
}));
