export interface FoodItem {
  id: string;
  name: string;
  amount: number; // grams
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  salt: number;
}

export interface AnalysisResult {
  foods: FoodItem[];
  totalCalories: number;
  confidence: number; // 0-100 percentage
  notes: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "朝食",
  lunch: "昼食",
  dinner: "夕食",
  snack: "間食",
};

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  totalSalt: number;
  imageData?: string; // base64 thumbnail
  createdAt: string;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DailySummaryData {
  date: string;
  meals: MealRecord[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  totalSalt: number;
}
