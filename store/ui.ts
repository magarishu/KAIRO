import { create } from 'zustand'

interface UIStore {
  isSidebarOpen: boolean;
  isSidebarMinimized: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebarMinimized: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  isSidebarMinimized: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebarMinimized: () => set((state) => ({ isSidebarMinimized: !state.isSidebarMinimized })),
}))
