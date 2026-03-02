// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],

  build: {
    // Disable source maps for smaller bundles and faster builds
    sourcemap: false,

    // Target modern browsers
    target: 'es2020',

    // Minification
    minify: 'esbuild',

    // Reduce concurrent operations to avoid file handle limits
    maxParallelFileOps: 10,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'framer-motion'],
          // Don't split MUI - keeps imports together
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'framer-motion'],
    // Pre-bundle MUI to reduce file operations
    esbuildOptions: {
      preserveSymlinks: true,
    }
  },

  // Server configuration
  server: {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  },
});
