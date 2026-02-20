# MealSnap

写真を撮るだけでカロリー・栄養素を自動計算する食事記録Webアプリ。

Claude Vision APIが料理を認識し、量の推定から栄養素計算まですべて自動で行います。食品データベースに依存しないため、どんな料理にも対応可能です。

## あすけんとの違い

| 従来の食事記録アプリ | MealSnap |
|---|---|
| 候補リストから料理を選ぶ | AIが写真から直接認識 |
| 数量を手動で入力・変更 | 皿のサイズからAIが自動推定 |
| DBにない食品は登録が面倒 | DB不要、AIが栄養知識から推定 |

## 主な機能

- **写真で自動分析** - 撮影またはアップロードするだけでAIが食事を分析
- **全栄養素を自動計算** - カロリー・タンパク質・脂質・炭水化物・食物繊維・塩分
- **複数料理の一括認識** - 弁当や定食など1枚の写真から全品目を個別に認識
- **量の微調整** - スライダーで量を変更すると栄養素も自動再計算
- **確信度表示** - AIの認識精度をパーセンテージとゲージで表示
- **日別ダッシュボード** - カロリー円形ゲージ、PFC進捗バー、食物繊維・塩分表示
- **週間レポート** - カロリー推移とPFCバランスのグラフ
- **目標設定** - 1日の目標カロリー・PFCをカスタマイズ

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| 言語 | TypeScript | 5.x |
| CSS | Tailwind CSS | 4.x |
| AI | Claude API (Vision) | claude-sonnet-4-5-20250929 |
| SDK | @anthropic-ai/sdk | 0.74.0 |
| グラフ | recharts | 3.7.0 |
| データ保存 | localStorage | - |

## セットアップ

### 1. クローン

```bash
git clone https://github.com/anroron/meal-tracker.git
cd meal-tracker
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` をプロジェクトルートに作成し、Anthropic APIキーを設定します。

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

APIキーは [Anthropic Console](https://console.anthropic.com/) から取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセスしてください。

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # ホーム（日別サマリー）
│   ├── capture/page.tsx        # 写真撮影→AI分析→記録
│   ├── history/page.tsx        # 週間レポート
│   ├── settings/page.tsx       # 目標設定
│   └── api/analyze/route.ts    # Claude Vision API連携
├── components/
│   ├── CameraCapture.tsx       # カメラ・画像アップロード
│   ├── MealResult.tsx          # 分析結果表示・編集
│   ├── MealCard.tsx            # 食事カード
│   ├── DailySummary.tsx        # 日別サマリー
│   ├── NutritionBar.tsx        # 栄養素プログレスバー
│   ├── WeeklyChart.tsx         # 週間グラフ
│   └── Navigation.tsx          # ボトムナビゲーション
└── lib/
    ├── types.ts                # 型定義
    ├── claude.ts               # APIクライアント
    └── storage.ts              # localStorage操作
```

## ライセンス

[MIT](LICENSE)
