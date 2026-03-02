# 🚨 CORS Fix - Backend Redeploy Required

## Problem
CORS errors blocking requests from `https://adminedizo.netlify.app`

## ✅ Solution Applied

Fixed `backend/server.js` CORS configuration:

```javascript
// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174',
    'https://www.edizo.in',
    'https://edizo.in',
    'https://adminedizo.netlify.app',  // ✅ Added admin domain
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🔄 Redeploy Backend to Render

### Step 1: Commit and Push Changes
```bash
git add backend/server.js
git commit -m "Fix CORS configuration for admin panel"
git push origin main
```

### Step 2: Trigger Redeploy on Render

**Option A: Automatic (if connected to Git)**
- Render will automatically redeploy when you push to Git
- Wait 2-3 minutes for deployment to complete

**Option B: Manual Redeploy**
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Step 3: Verify Deployment

1. **Check Logs**:
   - Go to Render Dashboard
   - Select your service
   - Click "Logs" tab
   - Wait for "Server running" message

2. **Test CORS**:
   ```bash
   curl -X OPTIONS https://edizo-backend.onrender.com/api/auth/login \
     -H "Origin: https://adminedizo.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```

   Look for:
   ```
   Access-Control-Allow-Origin: https://adminedizo.netlify.app
   ```

3. **Test Login**:
   - Visit: https://adminedizo.netlify.app
   - Try to login

---

## ⚠️ If CORS Still Fails

### Check Environment Variables on Render

1. Go to Render Dashboard
2. Select your backend service
3. Click "Environment" tab
4. Verify these are set:
   ```
   FRONTEND_URL=https://www.edizo.in
   ADMIN_URL=https://adminedizo.netlify.app
   CORS_ORIGIN=https://www.edizo.in,https://adminedizo.netlify.app
   ```

### Add CORS Environment Variable

If needed, add this environment variable:
```
CORS_ORIGIN=https://www.edizo.in,https://adminedizo.netlify.app,https://edizo.in
```

Then update `backend/server.js` to use it:

```javascript
// Read CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
  'https://www.edizo.in',
  'https://edizo.in',
  'https://adminedizo.netlify.app'
];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## ✅ Quick Fix Script

Create `fix-cors.sh`:

```bash
#!/bin/bash
echo "🔧 Fixing CORS configuration..."

# Commit changes
git add backend/server.js
git commit -m "Fix CORS for admin panel"
git push origin main

echo "✅ Changes pushed!"
echo "⏳ Waiting for Render to deploy..."
echo "📍 Check deployment status at: https://dashboard.render.com"
echo ""
echo "Deployment typically takes 2-3 minutes."
```

Run:
```bash
chmod +x fix-cors.sh
./fix-cors.sh
```

---

## 🎯 Verification Checklist

After redeploy:

- [ ] Backend logs show "Server running on port 3001"
- [ ] Visit https://adminedizo.netlify.app
- [ ] Login page loads
- [ ] Try to login
- [ ] No CORS errors in browser console
- [ ] Dashboard loads after login

---

## 📊 Expected Timeline

1. **Push to Git**: Immediate
2. **Render detects changes**: ~30 seconds
3. **Build starts**: ~1 minute
4. **Deployment completes**: 2-3 minutes
5. **Site live**: Immediate after build

**Total time: 3-5 minutes**

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Backend Logs**: https://dashboard.render.com → Your Service → Logs
- **Render CORS Docs**: https://render.com/docs/cors

---

## ✨ Summary

**What to do:**
1. ✅ CORS configuration fixed in `server.js`
2. 🔄 **Push changes to Git**
3. ⏳ **Wait for Render to redeploy (3-5 minutes)**
4. ✅ **Test login on admin panel**

**Your admin panel will work after the backend redeploys!**
