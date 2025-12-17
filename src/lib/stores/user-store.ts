"use client";

import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: string | null;
  emailVerifiedAt?: string | null;
};

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  hasFetched: false,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null, error: null, hasFetched: false }),

  fetchUser: async () => {
    const { loading, hasFetched } = get();
    if (loading || hasFetched) return;

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
