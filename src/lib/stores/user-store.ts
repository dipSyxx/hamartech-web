'use client'

import { create } from 'zustand'

type User = {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  role?: string | null
  emailVerifiedAt?: string | null
}

type UserState = {
  user: User | null
  loading: boolean
  error: string | null
  hasFetched: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
  refetchUser: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  hasFetched: false,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null, error: null, hasFetched: false }),

  fetchUser: async () => {
    const { loading, hasFetched } = get()
    if (loading || hasFetched) return

    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Kunne ikke hente brukerdata.')
      }

      const data = await res.json()
      set({ user: data.user ?? null, hasFetched: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Uventet feil'
      set({
        error: message,
        user: null,
        hasFetched: true,
      })
    } finally {
      set({ loading: false })
    }
  },

  refetchUser: async () => {
    const { loading } = get()
    if (loading) return

    // Reset hasFetched to force a re-fetch
    set({ hasFetched: false, loading: true, error: null })

    // Small delay to ensure session cookie is available after login
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const res = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        // For 401/404, don't show error (session might not be ready yet)
        // but set hasFetched to true to prevent infinite retries
        if (res.status === 401 || res.status === 404) {
          set({
            error: null,
            user: null,
            hasFetched: true, // Prevent infinite retries
          })
        } else {
          throw new Error(data?.error || 'Kunne ikke hente brukerdata.')
        }
        return
      }

      const data = await res.json()
      set({ user: data.user ?? null, hasFetched: true, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Uventet feil'
      set({
        error: message,
        user: null,
        hasFetched: true, // Set to true to prevent infinite retries
      })
    } finally {
      set({ loading: false })
    }
  },
}))
