# Demarrage local ultra simple (frontend + server)

Ce guide te permet de tout lancer en local avec **un seul fichier de credentials**.

## 1) Installer les dependances

```bash
npm install
npm --prefix server install
```

## 2) Creer ton fichier credentials unique

```bash
cp local.credentials.example local.credentials.env
```

Edite `local.credentials.env` et mets tes valeurs:

```env
PORT=3333
VITE_API_URL=http://localhost:3333
NOTION_API_KEY=secret_xxx
NOTION_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_RESOURCE_TYPE=auto
ALLOWED_ORIGINS=http://localhost:5173
```

C'est **le seul fichier** que tu dois modifier pour changer rapidement tes credentials.

## 3) Generer les fichiers techniques automatiquement

```bash
npm run local:sync
```

Cette commande genere:
- `.env` (frontend Vite)
- `server/.env` (backend Node)

## 4) Lancer le backend

Terminal 1:

```bash
npm run server:start
```

Tu dois voir un log proche de:

```txt
[BOOT] CyberScore Notion proxy listening on 3333
```

## 5) Lancer le frontend

Terminal 2:

```bash
npm run dev
```

Ouvre l'URL affichee par Vite (en general `http://localhost:5173`).

## 6) Verifications rapides

- Backend health:

```bash
curl http://localhost:3333/health
```

Doit retourner `ok: true`.

- App web:
  - La page charge
  - Pas d'erreur CORS dans la console
  - Les appels vont vers `http://localhost:3333/api/notion`

## 7) Quand tu changes des credentials

A chaque modification de `local.credentials.env`:

```bash
npm run local:sync
```

Puis relance le backend si necessaire.

## 8) Erreurs communes

- `401` Notion: `NOTION_API_KEY` incorrect
- `404` Notion: `NOTION_DB_ID` incorrect ou DB non partagee avec l'integration
- `404` persistant avec credentials corrects: force `NOTION_RESOURCE_TYPE=data_source` (ou `database`) puis `npm run local:sync`
- `CORS blocked origin`: ajuste `ALLOWED_ORIGINS`
