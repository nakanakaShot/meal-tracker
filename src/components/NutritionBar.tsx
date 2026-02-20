"use client";

interface NutritionBarProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export default function NutritionBar({
  label,
  current,
  goal,
  unit,
  color,
}: NutritionBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isOver = current > goal;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={isOver ? "text-red-500 font-medium" : "text-gray-500"}>
          {Math.round(current)} / {goal} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver ? "bg-red-400" : color
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
