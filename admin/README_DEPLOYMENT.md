# 🚀 EDIZO Admin Panel - Netlify Deployment (QUICK START)

## ⚡ 5-Minute Deployment

### Prerequisites
- Backend deployed on Render (get the URL)
- Netlify account (free)
- Node.js installed

---

## Step 1: Create .env File

Create `admin/.env`:
```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

**Replace `YOUR-BACKEND.onrender.com` with your actual Render backend URL!**

---

## Step 2: Test Build

```bash
cd admin
npm install
npm run build
```

✅ Build should complete without errors.

---

## Step 3: Deploy to Netlify

### Quick Method (Netlify CLI)

```bash
# Install Netlify CLI (one time only)
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd admin
netlify init
netlify deploy --prod
```

**When prompted:**
- Create new site: **Yes**
- Build command: **npm run build**
- Deploy directory: **dist**

### Set Environment Variable

```bash
netlify env:set VITE_API_URL https://YOUR-BACKEND.onrender.com/api
```

### Redeploy

```bash
netlify deploy --prod
```

**Done!** Your admin panel is live! 🎉

---

## Alternative: Deploy via Netlify Dashboard

1. Go to https://app.netlify.com
2. **Add new site** → **Import from Git**
3. Connect your GitHub/GitLab
4. Select your repository
5. Configure:
   - **Base directory**: `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin/dist`
6. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR-BACKEND.onrender.com/api`
7. Click **Deploy site**

---

## ✅ Verify Deployment

1. Visit your Netlify URL (e.g., `https://edizo-admin.netlify.app`)
2. Login with admin credentials
3. Test creating a service
4. Test creating an internship

---

## 🐛 Troubleshooting

### Build Fails
**Already Fixed!** TypeScript errors resolved in `tsconfig.app.json`

If still failing:
```bash
cd admin
rm -rf node_modules
npm install
npm run build
```

### Blank Page
**Cause**: API URL not set

**Fix**:
1. Netlify Dashboard → Site settings → Environment variables
2. Verify `VITE_API_URL` is set
3. Redeploy

### CORS Errors
Update backend CORS:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://edizo-admin.netlify.app'],
  credentials: true
}));
```

---

## 📝 What Was Fixed

✅ TypeScript build errors (relaxed strict mode)
✅ API function types (added proper annotations)
✅ Netlify configuration (redirects, headers)
✅ Environment variable setup

---

## 🔗 Useful Commands

```bash
# Build locally
npm run build

# Deploy
netlify deploy --prod

# Set env var
netlify env:set VITE_API_URL https://your-backend.com/api

# View logs
netlify deploy --build

# Open site
netlify open

# Rollback if needed
netlify rollback
```

---

## 📚 Full Documentation

- `DEPLOYMENT.md` - Detailed guide
- `DEPLOYMENT_SUMMARY.md` - Quick reference
- `deploy.bat` - Windows deploy script
- `deploy.sh` - Linux/Mac deploy script

---

## 🎯 Continuous Deployment

After initial setup, just push to Git:

```bash
git add .
git commit -m "Update admin"
git push origin main
```

Netlify will **automatically deploy**!

---

## ✨ Your Admin Panel is Ready!

**URL**: `https://edizo-admin.netlify.app`
**Backend**: `https://your-backend.onrender.com/api`

**Next**: Deploy frontend (same process, different directory)

---

**Questions?** Check `DEPLOYMENT.md` for detailed instructions.
