import { create } from 'zustand';

const useAlertStore = create((set) => ({
  alerts: [],
  sidebarOpen: false,
  
  // Add a new alert to the store
  addAlert: (alert) => set((state) => {
    const newAlert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...alert,
      isNew: true
    };
    return { alerts: [newAlert, ...state.alerts] };
  }),

  // Mark an alert as no longer "new" so the toast disappears
  markAlertOld: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, isNew: false } : a)
  })),

  // Clear a specific alert entirely
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),

  // Clear all alerts
  clearAll: () => set({ alerts: [] }),

  // Toggle Sidebar
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen })
}));

export default useAlertStore;
