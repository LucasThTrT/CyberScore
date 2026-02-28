import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/notion': {
          target: 'https://api.notion.com/v1',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/notion/, ''),
          headers: {
            Authorization: `Bearer ${env.VITE_NOTION_API_KEY || ''}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
        },
      },
    },
  };
});
