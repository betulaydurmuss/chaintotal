import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@types/index'

interface UserState {
  user: User | null
  setUser: (user: User) => void
  updateBalance: (balance: number) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        wallet: 'GA65QD5ZANY6TB3O7GCQGNNT7QFVAB4N5CQKGVE3BLNX6TD4YHTI4I7O',
        balance: 10000.00,
        queryCount: 0,
      },
      setUser: (user) => set({ user }),
      updateBalance: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'chaintotal-user',
    }
  )
)
