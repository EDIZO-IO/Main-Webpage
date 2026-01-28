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
  },
});
