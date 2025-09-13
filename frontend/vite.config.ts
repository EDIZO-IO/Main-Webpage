// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['firebase/app', 'firebase/auth'] // Add Firebase to included deps
  },
  
  build: {
    rollupOptions: {
      external: [] // Make sure Firebase is NOT externalized
    }
  }
});