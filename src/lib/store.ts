import { create } from 'zustand';
import { PhysioParams, WorkoutDay, generateWorkoutSchedule } from './physio-logic';

interface AppState {
  params: PhysioParams | null;
  schedule: WorkoutDay[];
  setParams: (params: PhysioParams) => void;
  toggleDayStatus: (date: Date) => void;
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
  toggleDayStatus: (date: Date) => {
    set((state) => {
      const newSchedule = state.schedule.map((day) => {
        if (day.date.getTime() === date.getTime()) {
          const statusOrder: ('planned' | 'completed' | 'missed')[] = ['planned', 'completed', 'missed'];
          const currentIndex = statusOrder.indexOf(day.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...day, status: statusOrder[nextIndex] };
        }
        return day;
      });
      localStorage.setItem('pulseweight-schedule', JSON.stringify(newSchedule));
      return { schedule: newSchedule };
    });
  },
  reset: () => {
    set({ params: null, schedule: [] });
    localStorage.removeItem('pulseweight-params');
    localStorage.removeItem('pulseweight-schedule');
  }
}));

// Function to load from localStorage on init
export function loadFromLocalStorage() {
  const savedParams = localStorage.getItem('pulseweight-params');
  const savedSchedule = localStorage.getItem('pulseweight-schedule');
  
  if (savedParams) {
    try {
      const params = JSON.parse(savedParams);
      params.startDate = new Date(params.startDate);
      params.targetDate = new Date(params.targetDate);
      
      let schedule: WorkoutDay[] = [];
      if (savedSchedule) {
        schedule = JSON.parse(savedSchedule).map((d: any) => ({
          ...d,
          date: new Date(d.date)
        }));
      } else {
        schedule = generateWorkoutSchedule(params);
      }
      
      useStore.setState({ params, schedule });
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }
}
