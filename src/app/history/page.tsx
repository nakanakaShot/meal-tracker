"use client";

import { useEffect, useState } from "react";
import { DailySummaryData, DailyGoals } from "@/lib/types";
import { getWeeklySummaries, getGoals, getToday } from "@/lib/storage";
import WeeklyChart from "@/components/WeeklyChart";
import Navigation from "@/components/Navigation";

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<DailySummaryData[]>([]);
  const [goals, setGoals] = useState<DailyGoals | null>(null);

  useEffect(() => {
    setSummaries(getWeeklySummaries(getToday()));
    setGoals(getGoals());
  }, []);

  if (!goals) return null;

  const avgCalories = Math.round(
    summaries.reduce((sum, s) => sum + s.totalCalories, 0) /
      Math.max(summaries.filter((s) => s.totalCalories > 0).length, 1)
  );

  const daysRecorded = summaries.filter((s) => s.meals.length > 0).length;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">履歴</h1>
        <p className="text-emerald-100 text-sm mt-1">週間レポート</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {avgCalories}
            </div>
            <div className="text-xs text-gray-500 mt-1">平均カロリー/日</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {daysRecorded}/7
            </div>
            <div className="text-xs text-gray-500 mt-1">記録日数</div>
          </div>
        </div>

        {/* Charts */}
        <WeeklyChart summaries={summaries} goals={goals} />

        {/* Daily breakdown */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-3">日別詳細</h3>
          <div className="space-y-2">
            {summaries
              .slice()
              .reverse()
              .map((s) => {
                const date = new Date(s.date);
                const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
                return (
                  <div
                    key={s.date}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="text-sm">
                      <span className="text-gray-700 font-medium">
                        {date.getMonth() + 1}/{date.getDate()}
                      </span>
                      <span className="text-gray-400 ml-1">
                        ({dayNames[date.getDay()]})
                      </span>
                    </div>
                    <div className="text-right">
                      {s.totalCalories > 0 ? (
                        <>
                          <span className="text-sm font-medium text-gray-700">
                            {s.totalCalories} kcal
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {s.meals.length}食
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-300">記録なし</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
