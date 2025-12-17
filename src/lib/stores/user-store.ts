"use client";

import { create } from "zustand";

type Role = "USER" | "ADMIN" | "APPROVER";

export type UserProfile = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: Role;
  emailVerifiedAt?: string | null | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type UserState = {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  hasFetched: false,

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, ...updates } };
    }),

  clearUser: () => set({ user: null, error: null }),

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Kunne ikke hente brukerdata.");
      }

      const data = await res.json();
      set({ user: data.user ?? null, hasFetched: true });
    } catch (error: any) {
      set({
        error: error?.message ?? "Uventet feil",
        user: null,
        hasFetched: true,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
