import { addDays, differenceInDays, isSameDay } from 'date-fns';

export interface PhysioParams {
  currentWeight: number; // kg
  targetWeight: number; // kg
  startDate: Date;
  targetDate: Date;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  intensityPreference: 'high' | 'low';
}

export interface WorkoutDay {
  date: Date;
  type: 'running' | 'cycling' | 'rest';
  durationMinutes: number;
  distanceKm: number;
  caloriesBurned: number;
  isMilestone: boolean;
  milestoneWeight?: number;
}

export function calculateBMR(params: PhysioParams): number {
  const { currentWeight, height, age, gender } = params;
  if (gender === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTotalExerciseDeficit(params: PhysioParams): number {
  const weightToLose = params.currentWeight - params.targetWeight;
  return weightToLose * 7700; // 7,700 kcal per kg
}

export function generateWorkoutSchedule(params: PhysioParams): WorkoutDay[] {
  const totalDeficit = calculateTotalExerciseDeficit(params);
  const totalDays = differenceInDays(params.targetDate, params.startDate);
  
  if (totalDays <= 0) return [];

  const dailyExerciseDeficit = totalDeficit / totalDays;
  const schedule: WorkoutDay[] = [];

  const milestones = [
    Math.floor(totalDays * 0.25),
    Math.floor(totalDays * 0.50),
    Math.floor(totalDays * 0.75),
    totalDays
  ];

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = addDays(params.startDate, i);
    const isMilestone = milestones.includes(i);
    
    // Simple alternation logic: Run, Cycle, Rest (3-day cycle)
    // Or maybe 5 days on, 2 days off? 
    // Let's do 2 days on (Alternating Run/Cycle), 1 day rest
    const cyclePos = i % 3;
    let type: 'running' | 'cycling' | 'rest' = 'rest';
    let caloriesBurned = 0;
    let distanceKm = 0;
    let durationMinutes = 0;

    if (cyclePos === 0) {
      type = 'running';
      caloriesBurned = dailyExerciseDeficit * 1.5;
      distanceKm = caloriesBurned / params.currentWeight / 1.0; 
      
      // Speed adjustments based on intensity
      const speedKmh = params.intensityPreference === 'high' ? 12 : 8; // 12 km/h vs 8 km/h
      durationMinutes = (distanceKm / speedKmh) * 60;
    } else if (cyclePos === 1) {
      type = 'cycling';
      caloriesBurned = dailyExerciseDeficit * 1.5;
      distanceKm = caloriesBurned / params.currentWeight / 0.4;
      
      const speedKmh = params.intensityPreference === 'high' ? 25 : 15; // 25 km/h vs 15 km/h
      durationMinutes = (distanceKm / speedKmh) * 60;
    } else {
      type = 'rest';
      caloriesBurned = 0;
      distanceKm = 0;
      durationMinutes = 0;
    }

    let milestoneWeight: number | undefined;
    if (isMilestone) {
      const progress = i / totalDays;
      milestoneWeight = params.currentWeight - (params.currentWeight - params.targetWeight) * progress;
    }

    schedule.push({
      date: currentDate,
      type,
      durationMinutes: Math.round(durationMinutes),
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      caloriesBurned: Math.round(caloriesBurned),
      isMilestone,
      milestoneWeight: milestoneWeight ? parseFloat(milestoneWeight.toFixed(1)) : undefined
    });
  }

  return schedule;
}
