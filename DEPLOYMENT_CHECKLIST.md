# 🚀 EDIZO Deployment Checklist

## Quick Deployment Guide

### Part 1: Backend (Render)

#### ✅ Pre-Deployment
- [ ] Create Render account at https://render.com
- [ ] Push code to GitHub/GitLab
- [ ] Note your MySQL database credentials

#### ✅ Deploy Backend
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect your repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `node server.js`
- [ ] Add Environment Variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `3001`
  - [ ] `DB_HOST` = your-database-host
  - [ ] `DB_USER` = your-db-user
  - [ ] `DB_PASSWORD` = your-db-password
  - [ ] `DB_NAME` = `edizo_db`
  - [ ] `JWT_SECRET` = (generate random string)
  - [ ] `CORS_ORIGIN` = `https://your-admin-url.netlify.app`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Copy your backend URL (e.g., `https://edizo-backend.onrender.com`)

#### ✅ Test Backend
- [ ] Visit `https://your-backend.onrender.com/health`
- [ ] Test API: `https://your-backend.onrender.com/api/services`
- [ ] Check logs for errors

---

### Part 2: Admin Panel (Netlify)

#### ✅ Pre-Deployment
- [ ] Create Netlify account at https://netlify.com
- [ ] Ensure backend is deployed and URL is ready

#### ✅ Deploy Admin Panel
- [ ] Go to `admin/` directory
- [ ] Create `.env` file:
  ```env
  VITE_API_URL=https://your-backend.onrender.com/api
  ```
- [ ] Commit and push to Git

#### ✅ Option A: Deploy via Netlify CLI
```bash
cd admin
npm install -g netlify-cli
netlify login
netlify init
# Select: Create new site
# Build command: npm run build
# Publish directory: dist
netlify env:set VITE_API_URL https://your-backend.onrender.com/api
netlify deploy --prod
```

#### ✅ Option B: Deploy via Dashboard
- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site" → "Import from Git"
- [ ] Select your repository
- [ ] Set Base Directory: `admin`
- [ ] Set Build Command: `npm run build`
- [ ] Set Publish Directory: `admin/dist`
- [ ] Add Environment Variable:
  - [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`
- [ ] Click "Deploy site"

#### ✅ Test Admin Panel
- [ ] Visit your Netlify URL
- [ ] Login with admin credentials
- [ ] Test creating/editing services and internships
- [ ] Check browser console for errors

---

### Part 3: Frontend (Optional - Netlify)

#### ✅ Deploy Frontend
- [ ] Go to `frontend/` directory
- [ ] Create `.env` file:
  ```env
  VITE_API_URL=https://your-backend.onrender.com/api
  ```
- [ ] Deploy using Netlify CLI or Dashboard
- [ ] Base Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `frontend/dist`

---

## 🔧 Configuration Files Created

```
admin/
  ├── .env.example          # Template for environment variables
  ├── .env                  # Your actual env vars (create this)
  └── netlify.toml          # Netlify configuration

backend/
  ├── .env.example          # Template for environment variables
  ├── .env                  # Your actual env vars (create this)
  └── render.yaml           # Render configuration
```

---

## 📝 Important URLs to Note

- **Backend API**: `https://your-backend.onrender.com/api`
- **Admin Panel**: `https://edizo-admin.netlify.app`
- **Frontend**: `https://edizo-frontend.netlify.app` (optional)

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS (automatic on Render/Netlify)
- [ ] Set up CORS properly
- [ ] Never commit `.env` files
- [ ] Use environment variables for secrets
- [ ] Enable database backups

---

## 🐛 Troubleshooting

### Backend Issues
- **Service won't start**: Check Render logs
- **Database connection fails**: Verify credentials and allow external connections
- **CORS errors**: Update `CORS_ORIGIN` environment variable

### Admin Panel Issues
- **Build fails**: Check build logs on Netlify
- **Blank page**: Verify `VITE_API_URL` is set
- **API errors**: Check CORS and backend URL

---

## 📊 Post-Deployment Tasks

- [ ] Run database migrations
- [ ] Create admin user
- [ ] Add sample services and internships
- [ ] Test all features
- [ ] Set up monitoring (UptimeRobot)
- [ ] Configure custom domains (optional)
- [ ] Set up SSL certificates (automatic)

---

## 🎯 Quick Test Commands

```bash
# Test Backend
curl https://your-backend.onrender.com/health

# Test Services API
curl https://your-backend.onrender.com/api/services

# Test Internships API
curl https://your-backend.onrender.com/api/internships
```

---

## 📚 Documentation Links

- [Netlify Docs](https://docs.netlify.com)
- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)

---

## ✅ Final Verification

- [ ] Backend health check passes
- [ ] Admin panel loads
- [ ] Can login to admin panel
- [ ] Can create/edit services
- [ ] Can create/edit internships
- [ ] Frontend displays data correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificates active

---

**🎉 Congratulations! Your EDIZO platform is now live!**
