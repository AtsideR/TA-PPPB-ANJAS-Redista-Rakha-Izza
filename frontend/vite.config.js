import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  // 1. Muat variabel environment berdasarkan mode (development/production)
  // Ini memungkinkan kita membaca VITE_API_URL dari file .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,

        pwaAssets: {
          disabled: true,
          config: false,
        },

        manifest: {
          name: 'ANJAS',
          short_name: 'ANJAS',
          description: 'antar jemput dan jasa titip',
          theme_color: '#ffffff',
        },

        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },

        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },
      })
    ],
    server: {
      proxy: {
        // Konfigurasi proxy untuk mengatasi CORS di Localhost
        '/api': {
          // 2. Gunakan URL dari .env, jika tidak ada gunakan fallback URL
          target: env.VITE_API_URL || 'https://api-anjas.vercel.app',
          changeOrigin: true,
          secure: true,
          // Opsional: sesuaikan rewrite path jika diperlukan backend
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  };
});