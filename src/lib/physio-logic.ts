import { addDays, differenceInDays } from 'date-fns';

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
  status: 'planned' | 'completed' | 'missed';
  durationMinutes: number;
  distanceKm: number;
  caloriesBurned: number;
  isMilestone: boolean;
  milestoneWeight?: number;
}

/**
 * Mifflin-St Jeor Equation for Basal Metabolic Rate
 */
export function calculateBMR(params: PhysioParams): number {
  const { currentWeight, height, age, gender } = params;
  if (gender === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate total caloric deficit required to reach target weight.
 * 1kg of body fat is approximately 7,700 kcal.
 */
export function calculateTotalExerciseDeficit(params: PhysioParams): number {
  const weightToLose = params.currentWeight - params.targetWeight;
  return Math.max(0, weightToLose * 7700);
}

export function generateWorkoutSchedule(params: PhysioParams): WorkoutDay[] {
  const totalDeficit = calculateTotalExerciseDeficit(params);
  const totalDays = differenceInDays(params.targetDate, params.startDate);
  
  if (totalDays <= 0) return [];

  // Calculate workout vs rest days to find the load multiplier
  // 3-day cycle (2 work, 1 rest) means 2/3 of days are active.
  const activeDaysCount = Math.ceil((totalDays + 1) * (2 / 3));
  const perActiveDayDeficit = totalDeficit / activeDaysCount;

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
    
    const cyclePos = i % 3;
    let type: 'running' | 'cycling' | 'rest' = 'rest';
    let caloriesBurned = 0;
    let distanceKm = 0;
    let durationMinutes = 0;

    if (cyclePos === 0) {
      type = 'running';
      caloriesBurned = perActiveDayDeficit;
      
      // Net burn for running is ~1 kcal/kg/km
      distanceKm = caloriesBurned / params.currentWeight;
      
      const speedKmh = params.intensityPreference === 'high' ? 12 : 9; 
      durationMinutes = (distanceKm / speedKmh) * 60;
    } else if (cyclePos === 1) {
      type = 'cycling';
      caloriesBurned = perActiveDayDeficit;
      
      /**
       * Cycling burn is more variable. 
       * Low intensity (~15km/h): ~0.35 kcal/kg/km
       * High intensity (~25km/h): ~0.45 kcal/kg/km
       */
      const efficiency = params.intensityPreference === 'high' ? 0.45 : 0.35;
      distanceKm = caloriesBurned / (params.currentWeight * efficiency);
      
      const speedKmh = params.intensityPreference === 'high' ? 26 : 18;
      durationMinutes = (distanceKm / speedKmh) * 60;
    }

    let milestoneWeight: number | undefined;
    if (isMilestone) {
      const progress = i / totalDays;
      milestoneWeight = params.currentWeight - (params.currentWeight - params.targetWeight) * progress;
    }

    schedule.push({
      date: currentDate,
      type,
      status: 'planned',
      durationMinutes: Math.round(durationMinutes),
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      caloriesBurned: Math.round(caloriesBurned),
      isMilestone,
      milestoneWeight: milestoneWeight ? parseFloat(milestoneWeight.toFixed(1)) : undefined
    });
  }

  /**
   * Final Validation: Ensure total burn matches goal.
   * If there's a significant drift due to rounding or edge cases, 
   * we could apply a correction to the last day, but for a 
   * scheduler, a clean trajectory is better.
   */

  return schedule;
}
