# Cyberpunk Pentester Leaderboard

A React + Vite + TailwindCSS dashboard for pentester rankings and vulnerability tracking, with a dark cyberpunk UI, motion effects, and score analytics.

## Stack

- React + Vite
- TailwindCSS
- Framer Motion
- Recharts
- Axios
- dotenv-compatible `.env` variables (`VITE_*`)

## Features

- Leaderboard page (`/`)
  - Neon animated ranking bars with dynamic scores
  - Live vulnerability feed cards with severity badges and glow/shake effect for newest entries
  - Manual refresh button + auto refresh every 30 minutes
- Score evolution page (`/stats`)
  - Multi-line cumulative score chart (one line per pentester)
  - Neon dark chart theme
- Reusable components
  - `src/components/LeaderboardBar.jsx`
  - `src/components/VulnerabilityCard.jsx`
  - `src/components/NeonCard.jsx`
  - `src/components/StatsChart.jsx`
- Clean architecture
  - `src/pages/`
  - `src/components/`
  - `src/services/notion.js`
  - `src/hooks/useVulnerabilities.jsx`
  - `src/utils/`

## Notion Schema

This app expects vulnerabilities in a Notion database and reads these properties:

- `title` / `Title` / `name`
- `severity` (`low`, `medium`, `high`)
- `date`
- `client`
- `client_logo_url`
- Optional pentester field: `pentester` (fallbacks supported: `researcher`, `owner`, `assigned_to`)

## Score Logic

- `low = 100`
- `medium = 200`
- `high = 500`

Scores are calculated on the frontend from vulnerabilities grouped by pentester.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example and set your Notion credentials:

```bash
cp .env.example .env
```

`.env`:

```bash
VITE_NOTION_API_KEY=your_notion_integration_secret
VITE_NOTION_DB_ID=your_database_id
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm run preview
```

## Notes

- The refresh interval is 30 minutes and can be adjusted in `src/hooks/useVulnerabilities.jsx`.
- In development, Notion calls go through the Vite proxy (`/api/notion`) to avoid browser CORS errors.
- For production, use a backend/API route proxy (or serverless function) with the same pattern, otherwise direct browser calls to Notion can fail and expose secrets.
- Ensure your Notion integration has access to the target database.
- If property names differ, update `src/services/notion.js` mapping.
