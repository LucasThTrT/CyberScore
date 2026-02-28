# CyberScore Deployment Guide (GitHub Pages + Railway)

This setup fixes the common issues:
- Railway: `Not Found` / `train has not arrived at the station`
- Frontend network/proxy failures
- CORS/PORT/start command mismatch

## 1) Backend Files (Railway-ready)

### `server/index.js`
- Express server
- Uses `process.env.PORT || 3333`
- Exposes:
  - `GET /health`
  - `POST /api/notion` (Notion database query proxy)
- CORS accepts:
  - your explicit `ALLOWED_ORIGINS`
  - `*.github.io`
  - localhost

### `server/package.json`
- Start command: `node index.js`

## 2) Railway Deployment (critical settings)

1. Push repo to GitHub.
2. Create a Railway project from this repo.
3. In Railway service settings:
- **Root Directory**: `server`
- **Start Command**: `npm start`
- (Build command default is fine; Railway installs deps from `server/package.json`)

4. Add Railway environment variables:
- `NOTION_API_KEY=...`
- `NOTION_DB_ID=...`
- `ALLOWED_ORIGINS=https://YOUR_GITHUB_USERNAME.github.io`
- `PORT` is optional (Railway injects it automatically)

5. Deploy and open logs.

Expected success log:
- `[BOOT] CyberScore Notion proxy listening on <port>`

## 3) Backend Health / Endpoint Checks

After Railway deploy, verify:

1. Health:
- `https://YOUR_RAILWAY_DOMAIN/health`
- Must return JSON with `ok: true`

2. Notion proxy:

```bash
curl -X POST https://YOUR_RAILWAY_DOMAIN/api/notion \
  -H "Content-Type: application/json" \
  -d '{"page_size":1}'
```

If it fails:
- `401` => bad `NOTION_API_KEY`
- `404` => bad `NOTION_DB_ID` or integration not shared with DB
- `403` => CORS blocked origin or Notion access issue

## 4) Frontend Environment

Use root `.env`:

```bash
VITE_API_URL=https://YOUR_RAILWAY_DOMAIN
```

Template is provided in `.env.example`.

## 5) Frontend Rebuild + Redeploy to GitHub Pages

1. Ensure Pages settings:
- `Settings > Pages > Source = GitHub Actions`

2. Ensure Actions variable exists:
- `Settings > Secrets and variables > Actions > Variables`
- `VITE_API_URL=https://YOUR_RAILWAY_DOMAIN`

3. Trigger deploy:
- Push to `main` (or run workflow manually)
- Workflow: `.github/workflows/deploy-pages.yml`

## 6) Logs Troubleshooting

### Railway logs
Check for:
- Boot log present
- No crash on startup
- Incoming `/api/notion` requests

If you see `Not Found / train has not arrived`:
- Root Directory is wrong (must be `server`)
- Start command is wrong (must be `npm start`)
- No successful deploy yet

### Browser devtools (frontend)
- Open Network tab
- Confirm calls go to: `https://YOUR_RAILWAY_DOMAIN/api/notion`
- Confirm response is not blocked by CORS

## 7) Final Checklist

- [ ] Railway Root Directory = `server`
- [ ] Railway Start Command = `npm start`
- [ ] Railway env vars set: `NOTION_API_KEY`, `NOTION_DB_ID`, optional `ALLOWED_ORIGINS`
- [ ] `https://YOUR_RAILWAY_DOMAIN/health` returns `ok: true`
- [ ] `POST /api/notion` works from curl
- [ ] Frontend `.env` has `VITE_API_URL=https://YOUR_RAILWAY_DOMAIN`
- [ ] GitHub Actions Pages deploy succeeded
- [ ] Frontend network requests target Railway and return data

## Local run (optional)

Backend:

```bash
cd server
npm install
cp .env.example .env
npm start
```

Frontend:

```bash
npm install
cp .env.example .env
npm run dev
```
