# 🚀 Frontend Deployment Guide (Fixed for Windows)

## ✅ Problem Fixed

The "too many open files" error has been addressed with these changes:

1. **Updated vite.config.js** - Reduced parallel file operations
2. **Updated package.json** - Added memory flags to build command
3. **Updated fix-build.bat** - Improved build script

---

## 📋 Pre-Deployment Checklist

### 1. Update API URL
Create `frontend/.env`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Test Build
```bash
npm run build
```

---

## 🌐 Deploy to Netlify

### Option 1: Using Netlify CLI (Recommended)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login
```bash
netlify login
```

#### Step 3: Initialize
```bash
cd frontend
netlify init
```

**Select:**
- Create new site: **Yes**
- Build command: `npm run build`
- Deploy directory: `dist`

#### Step 4: Set Environment Variable
```bash
netlify env:set VITE_API_URL https://your-backend.onrender.com/api
```

#### Step 5: Deploy
```bash
netlify deploy --prod
```

### Option 2: Via Netlify Dashboard

1. Go to https://app.netlify.com
2. **Add new site** → **Import from Git**
3. Select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api`
6. Click **Deploy site**

---

## 🔧 Configuration Files

### vite.config.js (Optimized for Windows)
```javascript
{
  build: {
    maxParallelFileOps: 10,  // Reduces file handle usage
    sourcemap: false,        // Faster builds
    minify: 'esbuild',       // Faster minification
  }
}
```

### package.json (With Memory Flags)
```json
{
  "scripts": {
    "build": "node --max-old-space-size=4096 node_modules/vite/bin/vite.js build"
  }
}
```

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐛 Troubleshooting

### Build Fails with "Too Many Open Files"

**Solution 1: Use Fix Script**
```bash
cd frontend
.\fix-build.bat
```

**Solution 2: Manual Fix**
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Solution 3: Clean Install**
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run build
```

**Solution 4: Use WSL2** (Best for long-term)
```bash
wsl
cd /mnt/c/Users/tech1/OneDrive/Desktop/edizo/Main-Webpage/frontend
npm run build
```

### Build Fails with Module Resolution Error

**Cause**: Corrupted node_modules

**Fix**:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Blank Page After Deploy

**Cause**: API URL not set

**Fix**:
1. Netlify Dashboard → Site settings → Environment variables
2. Verify `VITE_API_URL` is set
3. Redeploy

### CORS Errors

**Fix**: Update backend CORS configuration:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://edizo-frontend.netlify.app'],
  credentials: true
}));
```

---

## 📊 Build Optimization

### Local Build (Windows)
```bash
# Use the fix script
.\fix-build.bat

# Or manually
node --max-old-space-size=4096 node_modules/vite/bin/vite.js build
```

### Netlify Build (Linux)
Netlify runs on Linux, so it doesn't have the Windows file handle limit.
The build will work automatically with the configured `npm run build`.

---

## ✅ Verification

After deployment:

1. Visit your Netlify URL
2. Test all pages load
3. Verify API calls work
4. Check browser console for errors
5. Test on mobile devices

---

## 🎯 Continuous Deployment

After initial setup, just push to Git:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Netlify will **automatically build and deploy**!

---

## 📚 Useful Commands

```bash
# Build locally
npm run build

# Build with fix script
.\fix-build.bat

# Deploy
netlify deploy --prod

# Set environment variable
netlify env:set VITE_API_URL https://your-backend.com/api

# View logs
netlify deploy --build

# Open site
netlify open
```

---

## 🔗 Links

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Node.js Memory Options](https://nodejs.org/api/cli.html)

---

## ✨ Summary

**What Was Fixed:**
- ✅ vite.config.js optimized for Windows
- ✅ package.json build command includes memory flags
- ✅ fix-build.bat script improved
- ✅ Comprehensive troubleshooting guide

**Deployment Steps:**
1. Set `VITE_API_URL` in Netlify
2. Run `netlify deploy --prod`
3. Your site is live!

**Your frontend is ready to deploy!** 🎉
