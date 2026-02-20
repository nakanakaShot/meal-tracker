"use client";

import { MealRecord, MEAL_TYPE_LABELS } from "@/lib/types";

interface MealCardProps {
  meal: MealRecord;
  onDelete: (id: string) => void;
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const time = new Date(meal.createdAt).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            {MEAL_TYPE_LABELS[meal.mealType]}
          </span>
          <span className="text-xs text-gray-400 ml-2">{time}</span>
        </div>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-gray-400 hover:text-red-500 text-sm"
        >
          削除
        </button>
      </div>

      {meal.imageData && (
        <img
          src={meal.imageData}
          alt="食事"
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}

      <div className="space-y-1">
        {meal.foods.map((food) => (
          <div key={food.id} className="flex justify-between text-sm">
            <span className="text-gray-700">{food.name}</span>
            <span className="text-gray-500">{food.calories} kcal</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-emerald-700">
            {meal.totalCalories} kcal
          </span>
          <div className="flex gap-2 text-xs">
            <span className="text-blue-600">P:{Math.round(meal.totalProtein)}g</span>
            <span className="text-yellow-600">F:{Math.round(meal.totalFat)}g</span>
            <span className="text-orange-600">C:{Math.round(meal.totalCarbs)}g</span>
          </div>
        </div>
        <div className="flex gap-3 text-[11px] text-gray-400">
          <span>食物繊維:{Math.round(meal.totalFiber * 10) / 10}g</span>
          <span>塩分:{Math.round(meal.totalSalt * 10) / 10}g</span>
        </div>
      </div>
    </div>
  );
}
