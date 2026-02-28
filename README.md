# CyberScore

CyberScore is a React + Vite dashboard deployed on GitHub Pages, backed by a minimal Node.js proxy that securely fetches data from Notion.

## Architecture

- Frontend: React + Vite + Tailwind (static build on GitHub Pages)
- Backend: Express + Axios proxy (`/api/notion`) deployed on Railway / Render / Fly.io
- Secrets: only stored on backend (`NOTION_API_KEY`, `NOTION_DB_ID`)

## Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Create frontend env file:

```bash
cp .env.example .env
```

3. Set backend URL:

```bash
VITE_API_URL=http://localhost:3333
```

4. Run frontend locally:

```bash
npm run dev
```

## Backend Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create backend env file:

```bash
cp .env.example .env
```

3. Configure backend secrets:

```bash
PORT=3333
NOTION_API_KEY=secret_xxx
NOTION_DB_ID=your_notion_database_id
# Optional lock-down
# ALLOWED_ORIGINS=https://YOUR_GITHUB_USERNAME.github.io
```

4. Start backend:

```bash
npm start
```

Health check:

```bash
GET /health
```

Proxy endpoint:

```bash
POST /api/notion
```

## GitHub Pages Deployment (Frontend)

1. In `package.json`, set:
- `homepage`: `https://YOUR_GITHUB_USERNAME.github.io/CyberScore`
- `predeploy`: `npm run build`
- `deploy`: `gh-pages -d dist`

2. In `vite.config.js`, set:
- `base: '/CyberScore/'`

3. Deploy:

```bash
npm run deploy
```

4. In GitHub repo settings:
- Go to `Settings > Pages`
- Source should be the `gh-pages` branch

## Railway Deployment (Backend)

1. Push this repository to GitHub.
2. Create a new Railway project from the repo.
3. Set service root directory to `backend`.
4. Add env vars in Railway:
- `NOTION_API_KEY`
- `NOTION_DB_ID`
- `PORT` (optional, Railway sets this automatically)
- `ALLOWED_ORIGINS` (recommended)
5. Deploy and copy the backend URL.
6. Set frontend `VITE_API_URL` to that backend URL and redeploy frontend:

```bash
VITE_API_URL=https://your-backend.up.railway.app
npm run deploy
```

## Render / Fly.io Backend Notes

- Root/service directory: `backend`
- Build/install command: `npm install`
- Start command: `npm start`
- Required env vars:
  - `NOTION_API_KEY`
  - `NOTION_DB_ID`
  - `PORT` (platform usually injects this)
  - `ALLOWED_ORIGINS` (recommended)
- After deploy, set frontend `VITE_API_URL` to the backend public URL and redeploy GitHub Pages.

## Security Notes

- Never expose Notion API key in frontend `VITE_*` variables.
- Keep all Notion credentials only in backend env.
- Restrict CORS via `ALLOWED_ORIGINS` in production.

## Notion Schema Used

- `Name`
- `Vulnerability type`
- `Discovery date`
- `Severity level` (`Low`, `Medium`, `High`)
- `Found by`
