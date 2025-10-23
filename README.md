# RSS Summary App

A minimal Next.js dashboard that parses RSS feeds with [`rss-parser`](https://www.npmjs.com/package/rss-parser) and presents a concise preview of the latest articles.

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run build` – Builds the Next.js application for production.
- `npm run lint` – Runs ESLint via `next lint --no-error-on-unmatched-pattern`.
- `npm run test` – Executes the Vitest unit test suite.

## Vercel Deployment

When deploying to Vercel, set the **Root Directory** to the repository root (`.`). This ensures the Next.js app, configuration files, and `package.json` are detected correctly without additional adjustments.

## Configuration Notes

- Requires **Node.js 20 or newer** (`"engines": { "node": ">=20" }`).
- Uses the runtime types bundled with `rss-parser` so the extra `@types/rss-parser` package is no longer necessary.
- GitHub Actions install dependencies with `npm ci` and skip Playwright browser downloads by default.
