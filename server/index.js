import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3333;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

if (!NOTION_API_KEY || !NOTION_DB_ID) {
  console.error('[BOOT] Missing NOTION_API_KEY or NOTION_DB_ID.');
  process.exit(1);
}

const userDefinedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

const allowedOriginPatterns = [
  /^https:\/\/[a-z0-9-]+\.github\.io$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (userDefinedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'cyberscore-notion-proxy' });
});

app.post('/api/notion', async (req, res) => {
  try {
    const notionResponse = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
      {
        page_size: 100,
        ...(req.body || {}),
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    res.status(200).json(notionResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const details = error.response?.data || { message: 'Notion proxy request failed.' };
    console.error('[NOTION_PROXY_ERROR]', {
      status,
      message: details,
    });
    res.status(status).json(details);
  }
});

app.use((err, _req, res, _next) => {
  const message = err?.message || 'Internal server error';
  if (message.startsWith('CORS blocked origin')) {
    return res.status(403).json({ message });
  }
  return res.status(500).json({ message });
});

app.listen(PORT, () => {
  console.log(`[BOOT] CyberScore Notion proxy listening on ${PORT}`);
});
