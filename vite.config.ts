import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Charge les variables .env si elles existent
    const env = loadEnv(mode, process.cwd(), '');
    return {
      plugins: [react()],
      define: {
        // Cela rend la clé accessible via import.meta.env.VITE_GEMINI_API_KEY
        'process.env': env
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    };
});
