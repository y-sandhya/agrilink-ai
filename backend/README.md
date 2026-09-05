# AgriLink Backend — Step 1

This backend is the first real integration layer for the Figma Make frontend.

## What it does

- Express API
- MySQL connection
- Market-price storage
- data.gov.in market-data fetcher
- Daily scheduled market sync at 18:30 Asia/Kolkata by default
- Protected manual sync endpoint
- `/api/market-prices` endpoint for React
- `/api/health` endpoint

## 1. Create MySQL database

Run `schema.sql` in MySQL Workbench or the MySQL CLI.

## 2. Configure environment

Copy `.env.example` to `.env` and fill in:

- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- DATA_GOV_API_KEY
- SYNC_SECRET

`DATA_GOV_RESOURCE_URL` is configurable. Use the API URL shown by data.gov.in for the mandi resource available to your account.

## 3. Install

```bash
cd backend
npm install
```

## 4. Start

```bash
npm run dev
```

Backend runs on `http://localhost:5000` by default.

## 5. Test

Health:

```text
GET http://localhost:5000/api/health
```

Market data:

```text
GET http://localhost:5000/api/market-prices?crop=Tomato&state=Karnataka
```

Manual sync:

```text
POST http://localhost:5000/api/market-prices/sync
x-sync-secret: YOUR_SYNC_SECRET
```

The scheduled job runs automatically according to `MARKET_SYNC_CRON` and `MARKET_SYNC_TZ`.

## Important data rule

The official data.gov.in mandi dataset is daily-granularity. AgriLink therefore displays the **latest available market data** and its market-data date, rather than pretending every value is a second-by-second live quote.

Do not put the data.gov.in API key in React. It belongs only in the backend `.env` file.
