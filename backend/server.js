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
  console.error('Missing NOTION_API_KEY or NOTION_DB_ID environment variables.');
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked origin.'));
    },
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
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

    res.json(notionResponse.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { message: 'Notion proxy request failed.' };
    res.status(status).json(message);
  }
});

app.listen(PORT, () => {
  console.log(`CyberScore backend running on port ${PORT}`);
});
