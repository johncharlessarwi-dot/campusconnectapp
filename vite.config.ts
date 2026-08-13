import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss()
    ],

    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(
        process.env.GOOGLE_MAPS_PLATFORM_KEY || ''
      )
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },

    server: {
      // Keep HMR disabled when running in AI Studio
      // to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',

      // Disable file watching when HMR is disabled
      // to reduce CPU usage during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {}
    }
  };
});
