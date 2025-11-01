// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  
  optimizeDeps: {
    // Remove lucide-react exclusion - it should be optimized
    exclude: []
  },
  
  build: {
    rollupOptions: {
      // Keep empty - external is for library builds only
      external: []
    }
  }
});
