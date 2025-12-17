// vite.config.ts - Optimized for Performance
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['lucide-react'],
        },
      },
    },

    // Increase warning limit
    chunkSizeWarningLimit: 1000,

    // Disable source maps for production
    sourcemap: false,

    // CSS code splitting
    cssCodeSplit: true,
  },
});
