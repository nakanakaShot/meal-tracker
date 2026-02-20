"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DailySummaryData, DailyGoals } from "@/lib/types";

interface WeeklyChartProps {
  summaries: DailySummaryData[];
  goals: DailyGoals;
}

export default function WeeklyChart({ summaries, goals }: WeeklyChartProps) {
  const data = summaries.map((s) => {
    const date = new Date(s.date);
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}(${dayNames[date.getDay()]})`,
      カロリー: s.totalCalories,
      タンパク質: Math.round(s.totalProtein),
      脂質: Math.round(s.totalFat),
      炭水化物: Math.round(s.totalCarbs),
    };
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          週間カロリー推移
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <ReferenceLine
              y={goals.calories}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{ value: "目標", fontSize: 10 }}
            />
            <Bar dataKey="カロリー" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          週間PFCバランス
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="タンパク質" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="脂質" fill="#eab308" radius={[2, 2, 0, 0]} />
            <Bar dataKey="炭水化物" fill="#f97316" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
