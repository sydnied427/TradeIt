# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains **TradeIt**, a stock market learning and trading platform for beginners.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (not used by TradeIt — all state in localStorage)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State**: Zustand (portfolio in localStorage)
- **Stock Data**: yahoo-finance2 (real-time stock prices via Yahoo Finance)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── tradeit/            # TradeIt React frontend (previewPath: /)
│   └── api-server/         # Express API server (previewPath: /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TradeIt App

4-section beginner stock market learning platform:

1. **Jargon Explainer** (`/jargon`) — Quizlet-style flashcards with finance terms in plain English. Categories: Basics, Stocks, ETFs, Options, Crypto, Bonds. Cards flip on click.

2. **Paper Trading Simulator** (`/trading`) — $10,000 fake portfolio. Search stocks by ticker, buy/sell with real prices. Portfolio tracker persisted in localStorage.

3. **Stock Search** (`/search`) — Search any stock ticker. Shows plain-English company description, price, change%, sector, 52-week range. "Trending Today" section auto-loads popular stocks.

4. **Beginner Quiz** (`/quiz`) — Adaptive difficulty quiz (3 levels). Advances on 3-question winning streak, stays on wrong answers. Multiple choice with encouraging feedback.

## API Endpoints

- `GET /api/healthz` — health check
- `GET /api/stocks/quote?ticker=AAPL` — real stock quote from Yahoo Finance
- `GET /api/stocks/trending` — top 10 trending stocks (AAPL, MSFT, NVDA, TSLA, AMZN, GOOGL, META, AMD, PLTR, SPY)

## Key Notes

- Stock data comes from Yahoo Finance via `yahoo-finance2` v3 (requires `new YahooFinanceClass()` instantiation pattern)
- Frontend state is all in-memory/localStorage — no database needed
- The api-server does NOT import `@workspace/db` at runtime (no DATABASE_URL required)
