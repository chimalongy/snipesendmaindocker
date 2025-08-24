import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSelectedOutboundStore = create(
  persist(
    (set) => ({
      selectedoutbound: null,
      setSelectedOutbound: (selectedoutbound) => set({ selectedoutbound }),
      clearSelectedOutbound: () => set({ selectedoutbound: null }),
    }),
    {
      name: 'selected-outbound-storage', // key name in localStorage
      partialize: (state) => ({ selectedoutbound: state.selectedoutbound }), // only persist the 'user' field
    }
  )
);

export default useSelectedOutboundStore;
