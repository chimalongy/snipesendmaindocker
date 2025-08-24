import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSelectedEmailStore = create(
  persist(
    (set) => ({
      selectedemail: null,
      setSelectedEmail: (selectedemail) => set({ selectedemail }),
      clearSelectedEmail: () => set({ selectedemail: null }),
    }),
    {
      name: 'selected-email-storage', // key name in localStorage
      partialize: (state) => ({ selectedemail: state.selectedemail }), // only persist the 'user' field
    }
  )
);

export default useSelectedEmailStore;
