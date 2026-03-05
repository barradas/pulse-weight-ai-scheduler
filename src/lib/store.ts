import { create } from 'zustand';
import { PhysioParams, WorkoutDay, generateWorkoutSchedule } from './physio-logic';

interface AppState {
  params: PhysioParams | null;
  schedule: WorkoutDay[];
  setParams: (params: PhysioParams) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  params: null,
  schedule: [],
  setParams: (params) => {
    const schedule = generateWorkoutSchedule(params);
    set({ params, schedule });
    // LocalStorage persistence
    localStorage.setItem('pulseweight-params', JSON.stringify(params));
  },
  reset: () => {
    set({ params: null, schedule: [] });
    localStorage.removeItem('pulseweight-params');
  }
}));

// Function to load from localStorage on init
export function loadFromLocalStorage() {
  const saved = localStorage.getItem('pulseweight-params');
  if (saved) {
    try {
      const params = JSON.parse(saved);
      // Convert dates
      params.startDate = new Date(params.startDate);
      params.targetDate = new Date(params.targetDate);
      useStore.getState().setParams(params);
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }
}
