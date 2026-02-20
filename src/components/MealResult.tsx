"use client";

import { useState, useMemo } from "react";
import { AnalysisResult, FoodItem, MealType, MEAL_TYPE_LABELS } from "@/lib/types";

interface MealResultProps {
  result: AnalysisResult;
  onSave: (foods: FoodItem[], mealType: MealType) => void;
  onCancel: () => void;
}

export default function MealResult({ result, onSave, onCancel }: MealResultProps) {
  const originalFoods = useMemo(() => new Map(
    result.foods.map((f) => [f.id, { ...f }])
  ), [result.foods]);

  const [foods, setFoods] = useState<FoodItem[]>(result.foods);
  const [mealType, setMealType] = useState<MealType>(guessCurrentMealType());

  function guessCurrentMealType(): MealType {
    const hour = new Date().getHours();
    if (hour < 10) return "breakfast";
    if (hour < 15) return "lunch";
    if (hour < 20) return "dinner";
    return "snack";
  }

  const updateFoodAmount = (id: string, newAmount: number) => {
    setFoods((prev) =>
      prev.map((food) => {
        if (food.id !== id) return food;
        const original = originalFoods.get(id);
        if (!original) return food;
        const ratio = newAmount / original.amount;
        return {
          ...food,
          amount: newAmount,
          calories: Math.round(original.calories * ratio),
          protein: Math.round(original.protein * ratio * 10) / 10,
          fat: Math.round(original.fat * ratio * 10) / 10,
          carbs: Math.round(original.carbs * ratio * 10) / 10,
          fiber: Math.round(original.fiber * ratio * 10) / 10,
          salt: Math.round(original.salt * ratio * 10) / 10,
        };
      })
    );
  };

  const removeFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFiber = foods.reduce((sum, f) => sum + f.fiber, 0);
  const totalSalt = foods.reduce((sum, f) => sum + f.salt, 0);

  const confidence = Math.round(result.confidence);
  const confidenceColor =
    confidence >= 80 ? "text-emerald-600" :
    confidence >= 60 ? "text-yellow-600" :
    "text-red-500";
  const confidenceBarColor =
    confidence >= 80 ? "bg-emerald-500" :
    confidence >= 60 ? "bg-yellow-500" :
    "bg-red-400";

  return (
    <div className="space-y-4">
      {/* Header with confidence gauge */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">分析結果</h2>
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${confidenceBarColor}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={`text-sm font-semibold tabular-nums ${confidenceColor}`}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Meal type selector */}
      <div className="flex gap-2">
        {(Object.entries(MEAL_TYPE_LABELS) as [MealType, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setMealType(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                mealType === key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Food items — no PFC here, just name + kcal + slider */}
      <div className="space-y-3">
        {foods.map((food) => {
          const original = originalFoods.get(food.id);
          const baseAmount = original?.amount ?? food.amount;
          const sliderMin = Math.max(10, Math.round(baseAmount * 0.1));
          const sliderMax = Math.round(baseAmount * 3);
          return (
            <div
              key={food.id}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-medium text-gray-800">{food.name}</h3>
                  <p className="text-sm text-gray-500">{food.calories} kcal</p>
                </div>
                <button
                  onClick={() => removeFood(food.id)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  ×
                </button>
              </div>

              {/* Amount slider with description */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">食べた量を調整</span>
                  <span className="font-medium text-gray-700 tabular-nums">{food.amount}g</span>
                </div>
                <input
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  value={food.amount}
                  onChange={(e) =>
                    updateFoodAmount(food.id, Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>{sliderMin}g</span>
                  <span>{sliderMax}g</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nutrition summary — the single source of truth */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-emerald-700">
            {totalCalories}
          </span>
          <span className="text-emerald-600 ml-1">kcal</span>
        </div>

        {/* PFC row */}
        <div className="flex justify-around text-sm mb-3">
          <div className="text-center">
            <div className="font-semibold text-blue-600">
              {Math.round(totalProtein * 10) / 10}g
            </div>
            <div className="text-gray-500 text-xs">タンパク質</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-yellow-600">
              {Math.round(totalFat * 10) / 10}g
            </div>
            <div className="text-gray-500 text-xs">脂質</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-orange-600">
              {Math.round(totalCarbs * 10) / 10}g
            </div>
            <div className="text-gray-500 text-xs">炭水化物</div>
          </div>
        </div>

        {/* Fiber & salt row */}
        <div className="flex justify-center gap-6 pt-3 border-t border-emerald-100 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-700">
              {Math.round(totalFiber * 10) / 10}g
            </div>
            <div className="text-gray-500 text-xs">食物繊維</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">
              {Math.round(totalSalt * 10) / 10}g
            </div>
            <div className="text-gray-500 text-xs">塩分</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {result.notes && (
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          {result.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          onClick={() => onSave(foods, mealType)}
          disabled={foods.length === 0}
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          記録する
        </button>
      </div>
    </div>
  );
}
