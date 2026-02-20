import { MealRecord, DailyGoals, DailySummaryData } from "./types";

const MEALS_KEY = "meal-tracker-meals";
const GOALS_KEY = "meal-tracker-goals";

const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 60,
  fat: 55,
  carbs: 300,
};

export function getMeals(): MealRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMeal(meal: MealRecord): void {
  const meals = getMeals();
  meals.push(meal);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function deleteMeal(id: string): void {
  const meals = getMeals().filter((m) => m.id !== id);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function getMealsByDate(date: string): MealRecord[] {
  return getMeals().filter((m) => m.date === date);
}

export function getGoals(): DailyGoals {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  const data = localStorage.getItem(GOALS_KEY);
  return data ? JSON.parse(data) : DEFAULT_GOALS;
}

export function saveGoals(goals: DailyGoals): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getDailySummary(date: string): DailySummaryData {
  const meals = getMealsByDate(date);
  return {
    date,
    meals,
    totalCalories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
    totalProtein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
    totalFat: meals.reduce((sum, m) => sum + m.totalFat, 0),
    totalCarbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
    totalFiber: meals.reduce((sum, m) => sum + m.totalFiber, 0),
    totalSalt: meals.reduce((sum, m) => sum + m.totalSalt, 0),
  };
}

export function getWeeklySummaries(endDate: string): DailySummaryData[] {
  const summaries: DailySummaryData[] = [];
  const end = new Date(endDate);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    summaries.push(getDailySummary(dateStr));
  }
  return summaries;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getToday(): string {
  return formatDate(new Date());
}
