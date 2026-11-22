import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingConfig } from "@google/genai";

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
}

const SYSTEM_PROMPT = `あなたは食事の栄養分析の専門家です。
画像に写っている食事を分析し、以下のJSON形式のみで回答してください。余計なテキストは含めないでください。

{
  "foods": [
    {
      "name": "料理名",
      "amount": 推定量（数値、グラム）,
      "calories": カロリー（数値、kcal）,
      "protein": タンパク質（数値、g）,
      "fat": 脂質（数値、g）,
      "carbs": 炭水化物（数値、g）,
      "fiber": 食物繊維（数値、g）,
      "salt": 食塩相当量（数値、g）
    }
  ],
  "totalCalories": 合計カロリー（数値）,
  "confidence": 認識の確信度（数値、0〜100のパーセンテージ。料理が明確に判別できれば85〜95、やや不明瞭なら60〜80、かなり不明瞭なら30〜55）,
  "notes": "補足情報"
}

ルール:
- 皿のサイズや周囲の物から量を推定する
- 日本の一般的な食事量を基準にする
- 不明な場合は一般的な1人前の量で計算する
- 複数の料理がある場合はすべて個別にリストアップする
- ご飯、味噌汁、漬物なども見えていれば含める
- すべての栄養素は数値で返す（文字列は不可）
- confidenceは数値で返す（文字列は不可）
- JSONのみを返すこと

品数が多い場合の注意:
- 弁当や定食のように品数が多くても、各食品の量を過小評価しないこと
- 白ご飯は茶碗1杯150-200g（約250-340kcal）、弁当の場合は180-220gが一般的
- 小鉢・副菜（煮物、おひたし等）は1品あたり20-50gが一般的で、極端に少なく見積もらない
- 全食品を書き出した後、合計カロリーが料理の種類に対して妥当かクロスチェックすること
  - 幕の内弁当・仕出し弁当: 700-900kcal
  - コンビニ弁当: 500-800kcal
  - 定食: 600-900kcal
  合計が著しく低い場合は、各食品の量とカロリーを上方修正すること
- totalCaloriesは必ずfoods配列の各caloriesの合計と一致させること`;

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: "画像データが必要です" },
        { status: 400 },
      );
    }

    const mediaType = mimeType as
      | "image/jpeg"
      | "image/png"
      | "image/gif"
      | "image/webp";

    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: mediaType,
            data: image,
          },
        },
        {
          text: "この食事の栄養素を分析してください。",
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const textContent = response.text;
    if (!textContent) {
      throw new Error("Gemini returned empty response text.");
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = textContent.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const result = JSON.parse(jsonStr);

    // Add IDs to food items
    result.foods = result.foods.map(
      (food: Record<string, unknown>, index: number) => ({
        ...food,
        id: `food-${Date.now()}-${index}`,
      }),
    );

    // Recalculate totals from foods array (don't trust AI's totalCalories)
    result.totalCalories = result.foods.reduce(
      (sum: number, f: Record<string, unknown>) =>
        sum + (Number(f.calories) || 0),
      0,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "分析中にエラーが発生しました",
      },
      { status: 500 },
    );
  }
}
