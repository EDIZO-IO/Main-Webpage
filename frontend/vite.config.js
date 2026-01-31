// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],

  build: {
    // Disable source maps for smaller bundles
    sourcemap: false,

    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Minification
    minify: 'esbuild',

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  // Enable gzip and brotli compression
  server: {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  },
});
