# Frontend Build Instructions

## Current Status
The project is experiencing a build issue with Vite related to CSS processing. The error occurs during the build process:

```
[vite:html-inline-proxy] Could not load .../index.html?html-proxy&inline-css&index=0.css
```

## Troubleshooting Steps Taken
1. Removed `@reference` directive from CSS file
2. Fixed PostCSS configuration
3. Updated Vite configuration to disable CSS code splitting
4. Removed Tailwind CSS import temporarily

## Recommended Solution
To successfully build the project, please try the following:

### Option 1: Clean Install
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Option 2: Alternative Build Configuration
Update `vite.config.js` with:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Changed from '/' to relative path
  plugins: [react()],
  build: {
    sourcemap: false,
    cssCodeSplit: false,
    target: 'modules',
    minify: 'terser', // Changed from esbuild
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  }
});
```

### Option 3: Downgrade Vite Version
If the issue persists, try using an older version of Vite:
```bash
npm install vite@^4.4.5 @vitejs/plugin-react@^4.0.3
```

## Project Structure
The project is organized as follows:
- `/src` - Source code files
- `/public` - Static assets
- `/src/pages` - React pages/components
- `/src/components` - Reusable components
- `/src/assets` - Images and other assets

## Key Features Fixed
- Fixed undefined variable errors in motion components across multiple files
- Resolved animation issues in CertificateVerification.jsx
- Fixed Contact.jsx component errors
- Corrected various JSX syntax issues

## Deployment Notes
Once the build issue is resolved, the project can be deployed by:
1. Running `npm run build`
2. Serving the `dist` folder contents via a web server

For GitHub Pages deployment, ensure the `base` option in `vite.config.js` is set to your repository name.