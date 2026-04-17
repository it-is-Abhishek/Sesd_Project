import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: '..',
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:4001'
    }
  }
});
