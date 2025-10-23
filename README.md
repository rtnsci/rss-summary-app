# RSS Summary App

Next.js (TypeScript) 製の RSS/Atom 要約ビューアです。フィードの最新記事を取得し、タイトルと本文から抽出した約150字の要約を一覧表示します。

## 主な機能

- RSS/Atom URL を入力して最新記事をカード表示
- `rss-parser` を利用したサーバーサイドのフィード取得 API (`/api/feed`)
- タイトルと本文からの抽出要約（約150字、HTML 除去＆エンティティ復号）
- 読み込み中／結果なし／エラー状態の明示
- ワンクリックで試せる「デモFeed」ボタン

## 開発環境のセットアップ

```bash
npm install
npm run dev
```

- アプリは `http://localhost:3000` で起動します。
- `デモFeed` ボタンでサンプルの Vercel 公式 RSS をすぐに確認できます。

## テスト

- ユニットテスト: `npm run test`
- E2E テスト (Playwright): `npm run test:e2e`
- Lint: `npm run lint`
- 本番ビルド検証: `npm run build`

> **メモ**: Playwright のブラウザバイナリは初回のみ `npx playwright install --with-deps` で取得してください。

## ディレクトリ構成

```
app/
  page.tsx              # フロントページ
  api/feed/route.ts     # フィード取得 API
lib/
  summarize.ts          # 抽出要約ロジック
tests/
  unit/                 # Vitest によるユニットテスト
  e2e/                  # Playwright による E2E テスト
```

## ライセンス

MIT
