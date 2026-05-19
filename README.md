# CoinPulse 📈

> Real-time cryptocurrency market terminal built with Next.js and the CoinGecko API.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## Features

- **Live Market Data** — Top 50 coins by market cap with real-time prices, 24h change, and volume
- **Candlestick Charts** — Interactive OHLC charts powered by `lightweight-charts` with period switching (1D → Max)
- **Trending Coins** — Live trending list pulled from CoinGecko's trending endpoint
- **Currency Converter** — Convert any coin to USD and other currencies instantly
- **Market Categories** — Browse crypto sectors with 24h performance at a glance
- **Search** — Full coin search with `⌘K` keyboard shortcut
- **Coin Detail Pages** — Deep dive into any asset with exchange listings, trade history, and on-chain details

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + custom CSS |
| Charts | lightweight-charts 5 |
| UI Components | shadcn/ui + Radix UI |
| Data | CoinGecko Public API |
| Fonts | Syne · Space Mono · Inter |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/sapronaut/Coinpulse.git
cd Coinpulse

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Home — overview chart + trending + categories
│   ├── coins/
│   │   └── page.tsx          # All coins — markets table + chart + converter
│   └── [coinId]/
│       └── page.tsx          # Coin detail — full stats, exchanges, trades
├── components/
│   ├── Header.tsx            # Sticky nav with search trigger
│   ├── SearchModal.tsx       # ⌘K search overlay
│   ├── CandlestickChart.tsx  # OHLC chart with period selector
│   ├── DataTable.tsx         # Sortable markets table
│   ├── Converter.tsx         # Price converter widget
│   ├── TrendingSidebar.tsx   # Trending coins sidebar
│   └── home/
│       ├── CoinOverview.tsx  # Hero chart card
│       ├── TrendingCoins.tsx # Trending list
│       └── Categories.tsx    # Market categories grid
├── lib/
│   └── coingecko.actions.ts  # API fetcher
└── constants.ts              # Chart config, period buttons
```

---

## API

This project uses the [CoinGecko Public API](https://www.coingecko.com/en/api) (free tier, no API key required).

Key endpoints used:

- `GET /coins/markets` — market data for top coins
- `GET /coins/{id}/ohlc` — OHLC candlestick data
- `GET /search/trending` — trending coins
- `GET /coins/categories` — market categories
- `GET /coins/{id}` — full coin details

> **Note:** The free tier has rate limits (~30 calls/min). If you hit 429 errors, wait a moment and refresh.

---

## Acknowledgements

- [CoinGecko](https://www.coingecko.com) for the free crypto data API
- [lightweight-charts](https://github.com/tradingview/lightweight-charts) by TradingView for the charting library
- [shadcn/ui](https://ui.shadcn.com) for the component primitives
