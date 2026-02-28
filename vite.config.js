import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const resolvedBase =
  process.env.VITE_BASE_PATH ||
  (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/');

export default defineConfig({
  plugins: [react()],
  base: resolvedBase,
});
