"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailySummaryData, DailyGoals } from "@/lib/types";
import { getDailySummary, getGoals, getToday, deleteMeal } from "@/lib/storage";
import DailySummaryComponent from "@/components/DailySummary";
import MealCard from "@/components/MealCard";
import Navigation from "@/components/Navigation";

export default function HomePage() {
  const [summary, setSummary] = useState<DailySummaryData | null>(null);
  const [goals, setGoals] = useState<DailyGoals | null>(null);

  const loadData = () => {
    setSummary(getDailySummary(getToday()));
    setGoals(getGoals());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    deleteMeal(id);
    loadData();
  };

  if (!summary || !goals) return null;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">MealSnap</h1>
        <p className="text-emerald-100 text-sm mt-1">今日の食事記録</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Daily summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <DailySummaryComponent summary={summary} goals={goals} />
        </div>

        {/* Quick capture button */}
        <Link
          href="/capture"
          className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center rounded-xl font-medium text-lg shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600 transition-colors"
        >
          📸 食事を記録する
        </Link>

        {/* Today's meals */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">今日の食事</h2>
          {summary.meals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🍽️</p>
              <p>まだ記録がありません</p>
              <p className="text-sm">写真を撮って食事を記録しましょう</p>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
