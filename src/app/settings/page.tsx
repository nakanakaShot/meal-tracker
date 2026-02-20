"use client";

import { useEffect, useState } from "react";
import { DailyGoals } from "@/lib/types";
import { getGoals, saveGoals } from "@/lib/storage";
import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const [goals, setGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 60,
    fat: 55,
    carbs: 300,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const handleSave = () => {
    saveGoals(goals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm("すべての食事記録を削除しますか？この操作は取り消せません。")) {
      localStorage.removeItem("meal-tracker-meals");
      alert("食事記録を削除しました。");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-emerald-100 text-sm mt-1">目標値の設定</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Goals */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-800">1日の目標</h2>

          <div>
            <label className="text-sm text-gray-600 flex justify-between mb-1">
              <span>カロリー</span>
              <span className="font-medium">{goals.calories} kcal</span>
            </label>
            <input
              type="range"
              min={1000}
              max={4000}
              step={50}
              value={goals.calories}
              onChange={(e) =>
                setGoals({ ...goals, calories: Number(e.target.value) })
              }
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1000</span>
              <span>4000</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 flex justify-between mb-1">
              <span>タンパク質</span>
              <span className="font-medium">{goals.protein} g</span>
            </label>
            <input
              type="range"
              min={30}
              max={200}
              step={5}
              value={goals.protein}
              onChange={(e) =>
                setGoals({ ...goals, protein: Number(e.target.value) })
              }
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>30g</span>
              <span>200g</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 flex justify-between mb-1">
              <span>脂質</span>
              <span className="font-medium">{goals.fat} g</span>
            </label>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={goals.fat}
              onChange={(e) =>
                setGoals({ ...goals, fat: Number(e.target.value) })
              }
              className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>20g</span>
              <span>120g</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 flex justify-between mb-1">
              <span>炭水化物</span>
              <span className="font-medium">{goals.carbs} g</span>
            </label>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={goals.carbs}
              onChange={(e) =>
                setGoals({ ...goals, carbs: Number(e.target.value) })
              }
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>100g</span>
              <span>500g</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              saved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {saved ? "✓ 保存しました" : "目標を保存"}
          </button>
        </div>

        {/* Data management */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h2 className="font-bold text-gray-800">データ管理</h2>
          <button
            onClick={handleClearData}
            className="w-full py-3 rounded-xl border border-red-300 text-red-500 font-medium hover:bg-red-50"
          >
            食事記録をすべて削除
          </button>
        </div>

        {/* About */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>MealSnap v1.0</p>
          <p className="mt-1">Powered by Claude Vision AI</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
