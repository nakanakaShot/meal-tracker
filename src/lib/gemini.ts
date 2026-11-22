import { AnalysisResult } from "./types";

export async function analyzeMealImage(
  imageBase64: string,
  mimeType: string
): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64, mimeType }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "分析に失敗しました");
  }

  return response.json();
}
