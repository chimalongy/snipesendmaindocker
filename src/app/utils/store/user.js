import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // key name in localStorage
      partialize: (state) => ({ user: state.user }), // only persist the 'user' field
    }
  )
);

export default useUserStore;
