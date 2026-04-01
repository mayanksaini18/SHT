export interface Exercise {
  name: string;
  type: string;
  duration: number;
  calories: number;
}

export interface Fitness {
  _id: string;
  user: string;
  date: string;
  exercises: Exercise[];
  totalDuration: number;
  totalCalories: number;
  createdAt: string;
}

export interface FitnessStats {
  weeklyDuration: number;
  weeklyCalories: number;
  totalExercises: number;
  activeDays: number;
}
