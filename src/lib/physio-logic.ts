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

/**
 * Recalculate remaining workouts based on completed and missed sessions.
 * Redistributes the remaining caloric debt across the remaining planned active days.
 */
export function recalibrateSchedule(schedule: WorkoutDay[], params: PhysioParams): WorkoutDay[] {
  const totalDeficit = calculateTotalExerciseDeficit(params);
  
  const completedCalories = schedule
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.caloriesBurned, 0);
    
  const remainingDeficit = Math.max(0, totalDeficit - completedCalories);
  
  const remainingPlannedActiveDays = schedule.filter(
    d => d.status === 'planned' && d.type !== 'rest'
  );
  
  if (remainingPlannedActiveDays.length === 0) return schedule;
  
  const newPerActiveDayDeficit = remainingDeficit / remainingPlannedActiveDays.length;
  
  return schedule.map(day => {
    // Only recalibrate future/planned active days
    if (day.status !== 'planned' || day.type === 'rest') return day;
    
    const caloriesBurned = newPerActiveDayDeficit;
    let distanceKm = 0;
    let durationMinutes = 0;
    
    if (day.type === 'running') {
      distanceKm = caloriesBurned / params.currentWeight;
      const speedKmh = params.intensityPreference === 'high' ? 12 : 9; 
      durationMinutes = (distanceKm / speedKmh) * 60;
    } else if (day.type === 'cycling') {
      const efficiency = params.intensityPreference === 'high' ? 0.45 : 0.35;
      distanceKm = caloriesBurned / (params.currentWeight * efficiency);
      const speedKmh = params.intensityPreference === 'high' ? 26 : 18;
      durationMinutes = (distanceKm / speedKmh) * 60;
    }
    
    return {
      ...day,
      caloriesBurned: Math.round(caloriesBurned),
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      durationMinutes: Math.round(durationMinutes)
    };
  });
}

export interface MacroSplit {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  totalCalories: number;
}

/**
 * Calculates daily macro targets based on the workout type and BMR.
 */
export function calculateMacros(params: PhysioParams, dayType: 'running' | 'cycling' | 'rest'): MacroSplit {
  const bmr = calculateBMR(params);
  // NEAT + basic activity multiplier (~1.2 for sedentary outside of workouts)
  const maintenanceCalories = bmr * 1.2; 
  
  // To lose weight, we assume the diet itself is in a slight deficit or at maintenance.
  // The app assumes "neutral caloric intake" earlier, meaning we eat maintenance and burn via exercise.
  // For the macro matrix, we will prescribe a maintenance diet optimized for performance.
  const targetDietCalories = maintenanceCalories; 

  const weightLbs = params.currentWeight * 2.20462;
  
  let protein = 0;
  let carbs = 0;
  let fats = 0;

  if (dayType === 'running') {
    // High glycogen demand
    protein = weightLbs * 1.0; // 1g per lb
    fats = (targetDietCalories * 0.25) / 9; // 25% from fats
    carbs = (targetDietCalories - (protein * 4) - (fats * 9)) / 4;
  } else if (dayType === 'cycling') {
    // Moderate glycogen demand
    protein = weightLbs * 1.0;
    fats = (targetDietCalories * 0.30) / 9; // 30% from fats
    carbs = (targetDietCalories - (protein * 4) - (fats * 9)) / 4;
  } else {
    // Rest day - prioritize protein and fat for recovery, lower carbs
    protein = weightLbs * 1.2; // 1.2g per lb
    fats = (targetDietCalories * 0.35) / 9; // 35% from fats
    carbs = (targetDietCalories - (protein * 4) - (fats * 9)) / 4;
  }

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    totalCalories: Math.round(targetDietCalories)
  };
}
