"use client";

import { DailySummaryData, DailyGoals } from "@/lib/types";
import NutritionBar from "./NutritionBar";

interface DailySummaryProps {
  summary: DailySummaryData;
  goals: DailyGoals;
}

export default function DailySummary({ summary, goals }: DailySummaryProps) {
  const caloriePercentage = Math.min(
    (summary.totalCalories / goals.calories) * 100,
    100
  );
  const remaining = Math.max(goals.calories - summary.totalCalories, 0);

  return (
    <div className="space-y-4">
      {/* Calorie circle */}
      <div className="text-center py-4">
        <div className="relative inline-block">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={
                summary.totalCalories > goals.calories ? "#ef4444" : "#10b981"
              }
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${caloriePercentage * 4.4} 440`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {summary.totalCalories}
            </span>
            <span className="text-sm text-gray-500">/ {goals.calories} kcal</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {remaining > 0
            ? `あと ${remaining} kcal`
            : `${summary.totalCalories - goals.calories} kcal オーバー`}
        </p>
      </div>

      {/* Nutrition bars */}
      <div className="space-y-3 bg-white rounded-xl p-4 border border-gray-100">
        <NutritionBar
          label="タンパク質"
          current={summary.totalProtein}
          goal={goals.protein}
          unit="g"
          color="bg-blue-400"
        />
        <NutritionBar
          label="脂質"
          current={summary.totalFat}
          goal={goals.fat}
          unit="g"
          color="bg-yellow-400"
        />
        <NutritionBar
          label="炭水化物"
          current={summary.totalCarbs}
          goal={goals.carbs}
          unit="g"
          color="bg-orange-400"
        />
        <div className="flex gap-4 pt-2 border-t border-gray-50 text-sm text-gray-500">
          <span>食物繊維: {Math.round(summary.totalFiber * 10) / 10}g</span>
          <span>塩分: {Math.round(summary.totalSalt * 10) / 10}g</span>
        </div>
      </div>
    </div>
  );
}
