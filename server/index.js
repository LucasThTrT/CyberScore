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
const NOTION_DB_ID_RAW = process.env.NOTION_DB_ID || '';
const NOTION_RESOURCE_TYPE = (process.env.NOTION_RESOURCE_TYPE || 'auto').toLowerCase();

if (!NOTION_API_KEY || !NOTION_DB_ID_RAW) {
  console.error('[BOOT] Missing NOTION_API_KEY or NOTION_DB_ID.');
  process.exit(1);
}

function extractNotionId(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';

  // Accept pasted database URL, UUID, or 32-char ID.
  const match = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32}/i);
  return match ? match[0] : raw;
}

const NOTION_DB_ID = extractNotionId(NOTION_DB_ID_RAW);

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
    const payload = {
      page_size: 100,
      ...(req.body || {}),
    };

    const callNotion = (url, notionVersion) =>
      axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': notionVersion,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

    // Notion has two models depending on API version:
    // - /v1/databases/{id}/query (legacy 2022-06-28)
    // - /v1/data_sources/{id}/query (2025-09-03)
    if (NOTION_RESOURCE_TYPE === 'database') {
      const notionResponse = await callNotion(
        `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
        '2022-06-28'
      );
      return res.status(200).json(notionResponse.data);
    }

    if (NOTION_RESOURCE_TYPE === 'data_source') {
      const notionResponse = await callNotion(
        `https://api.notion.com/v1/data_sources/${NOTION_DB_ID}/query`,
        '2025-09-03'
      );
      return res.status(200).json(notionResponse.data);
    }

    // auto mode: try legacy database endpoint first, then fallback to data source.
    try {
      const notionResponse = await callNotion(
        `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
        '2022-06-28'
      );
      return res.status(200).json(notionResponse.data);
    } catch (dbError) {
      if (dbError.response?.status !== 404) {
        throw dbError;
      }

      const notionResponse = await callNotion(
        `https://api.notion.com/v1/data_sources/${NOTION_DB_ID}/query`,
        '2025-09-03'
      );
      return res.status(200).json(notionResponse.data);
    }
  } catch (error) {
    const status = error.response?.status || 500;
    const details = error.response?.data || { message: 'Notion proxy request failed.' };
    const notionMessage =
      typeof details?.message === 'string' ? details.message : error.message || 'Notion proxy request failed.';
    console.error('[NOTION_PROXY_ERROR]', {
      status,
      message: details,
    });
    if (status === 404) {
      return res.status(404).json({
        message:
          'Notion resource not found or not shared with integration. Verify NOTION_DB_ID (database or data source ID), Add connections, and workspace match.',
        notion_error: notionMessage,
      });
    }
    return res.status(status).json(details);
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
