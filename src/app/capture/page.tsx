"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult, FoodItem, MealType, MealRecord } from "@/lib/types";
import { saveMeal, getToday } from "@/lib/storage";
import { analyzeMealImage } from "@/lib/claude";
import CameraCapture from "@/components/CameraCapture";
import MealResult from "@/components/MealResult";
import Navigation from "@/components/Navigation";

export default function CapturePage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  const handleCapture = async (base64: string, mimeType: string) => {
    setImageData(`data:${mimeType};base64,${base64}`);
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeMealImage(base64, mimeType);
      setResult(analysisResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "分析中にエラーが発生しました"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = (foods: FoodItem[], mealType: MealType) => {
    const meal: MealRecord = {
      id: `meal-${Date.now()}`,
      date: getToday(),
      mealType,
      foods,
      totalCalories: foods.reduce((sum, f) => sum + f.calories, 0),
      totalProtein: foods.reduce((sum, f) => sum + f.protein, 0),
      totalFat: foods.reduce((sum, f) => sum + f.fat, 0),
      totalCarbs: foods.reduce((sum, f) => sum + f.carbs, 0),
      totalFiber: foods.reduce((sum, f) => sum + f.fiber, 0),
      totalSalt: foods.reduce((sum, f) => sum + f.salt, 0),
      imageData: imageData || undefined,
      createdAt: new Date().toISOString(),
    };

    saveMeal(meal);
    router.push("/");
  };

  const handleCancel = () => {
    setResult(null);
    setError(null);
    setImageData(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">食事を記録</h1>
        <p className="text-emerald-100 text-sm mt-1">
          写真を撮って自動で栄養計算
        </p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {result ? (
            <MealResult
              result={result}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <CameraCapture onCapture={handleCapture} disabled={isAnalyzing} />

              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-3" />
                  <p className="text-gray-600 font-medium">
                    AIが食事を分析中...
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    料理の認識・栄養素を計算しています
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                  <p className="text-red-600 text-sm">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 text-sm underline mt-2"
                  >
                    もう一度試す
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
