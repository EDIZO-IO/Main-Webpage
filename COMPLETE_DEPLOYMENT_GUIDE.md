# 🚀 EDIZO Complete Deployment Guide

## Overview
This guide covers deploying the EDIZO platform to **Render** (backend) and **Netlify** (frontend & admin panel).

---

## 📋 Prerequisites

1. **Accounts Needed:**
   - [Render](https://render.com) account (free tier available)
   - [Netlify](https://netlify.com) account (free tier available)
   - MySQL database (remote or cloud-hosted)
   - GitHub/GitLab account for version control

2. **Database Setup:**
   - Ensure MySQL database is accessible from the internet
   - Create database: `edizo_db`
   - Create user with full access
   - Run all migrations (see Database Setup section)

---

## 🗄️ Database Setup

### Option 1: Use Existing Remote MySQL
```sql
-- Connect to your MySQL server
mysql -h YOUR_HOST -u remote_user -p

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS edizo_db;

-- Import schema
USE edizo_db;
SOURCE /path/to/backend/database/schema.sql;

-- Or run migrations in order
SOURCE /path/to/backend/database/migrations/001_update_internships_schema.sql;
SOURCE /path/to/backend/database/migrations/002_update_services_schema.sql;
SOURCE /path/to/backend/database/migrations/003_remove_image_columns.sql;
```

### Option 2: Use Render PostgreSQL (Free)
1. Go to Render Dashboard → New + → PostgreSQL
2. Create database (free tier: 1GB storage)
3. Get connection string from dashboard
4. Update backend environment variables

### Option 3: Use PlanetScale (Free MySQL)
1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection credentials
4. Update backend environment variables

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Update `backend/package.json`** (already configured):
   ```json
   {
     "type": "module",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Verify `backend/render.yaml` exists** (already created):
   ```yaml
   services:
     - type: web
       name: edizo-backend
       env: node
       region: oregon
       plan: free
       buildCommand: npm install
       startCommand: node server.js
   ```

### Step 2: Deploy to Render

#### Method A: Via Render Dashboard (Recommended)

1. **Create Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `edizo-backend`
     - **Region**: Oregon (closest to users)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: `Free`

2. **Set Environment Variables:**
   Click "Advanced" → Add these variables:

   | Key | Value | Required |
   |-----|-------|----------|
   | `NODE_ENV` | `production` | ✅ |
   | `PORT` | `3001` | ✅ |
   | `DB_HOST` | `your-database-host.com` | ✅ |
   | `DB_USER` | `your-db-user` | ✅ |
   | `DB_PASSWORD` | `your-db-password` | ✅ |
   | `DB_NAME` | `edizo_db` | ✅ |
   | `DB_PORT` | `3306` | ✅ |
   | `JWT_SECRET` | `generate-secure-random-string` | ✅ |
   | `FRONTEND_URL` | `https://your-frontend.netlify.app` | ✅ |
   | `ADMIN_URL` | `https://edizo-admin.netlify.app` | ✅ |
   | `CORS_ORIGIN` | `https://your-frontend.netlify.app,https://edizo-admin.netlify.app` | ✅ |
   | `RATE_LIMIT_WINDOW_MS` | `900000` | Optional |
   | `RATE_LIMIT_MAX_REQUESTS` | `100` | Optional |

3. **Create Service:**
   - Click "Create Web Service"
   - Wait for deployment (~2-5 minutes)

#### Method B: Via Render CLI

```bash
# Install CLI
npm install -g @render-cloud/cli

# Login
render login

# Deploy
cd backend
render up
```

### Step 3: Verify Backend

1. **Check Health Endpoint:**
   ```bash
   curl https://edizo-backend.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-03-02T12:00:00.000Z",
     "environment": "production"
   }
   ```

2. **Test API Endpoint:**
   ```bash
   curl https://edizo-backend.onrender.com/api/services
   ```

3. **Check Logs:**
   - Render Dashboard → Your Service → Logs tab
   - Monitor for errors

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

1. **Update `frontend/.env`** (for local testing):
   ```env
   VITE_API_URL=https://edizo-backend.onrender.com/api
   ```

2. **Test Build Locally:**
   ```bash
   cd frontend
   npm run build
   ```

### Step 2: Deploy to Netlify

#### Method A: Via Netlify CLI (Recommended)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Initialize:**
   ```bash
   cd frontend
   netlify init
   ```
   Select:
   - Create & configure a new site: **Yes**
   - Team: Your team (or personal)
   - Site name: `edizo-frontend` (or preferred)
   - Build command: `npm run build`
   - Deploy directory: `dist`

4. **Set Environment Variables:**
   ```bash
   netlify env:set VITE_API_URL https://edizo-backend.onrender.com/api
   ```

5. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

#### Method B: Via Netlify Dashboard

1. **Create New Site:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect Git provider (GitHub/GitLab)
   - Select repository

2. **Configure Build:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

3. **Set Environment Variables:**
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://edizo-backend.onrender.com/api`

4. **Deploy:**
   - Click "Deploy site"

### Step 3: Verify Frontend

1. Visit your Netlify URL (e.g., `https://edizo-frontend.netlify.app`)
2. Test user registration/login
3. Verify API calls work (check browser console)

---

## 👨‍💼 Admin Panel Deployment (Netlify)

### Step 1: Prepare Admin Panel

1. **Update `admin/.env`** (for local testing):
   ```env
   VITE_API_URL=https://edizo-backend.onrender.com/api
   ```

2. **Test Build Locally:**
   ```bash
   cd admin
   npm run build
   ```

### Step 2: Deploy to Netlify

#### Method A: Via Netlify CLI

1. **Initialize:**
   ```bash
   cd admin
   netlify init
   ```
   Select:
   - Create & configure a new site: **Yes**
   - Site name: `edizo-admin` (important for branding)
   - Build command: `npm run build`
   - Deploy directory: `dist`

2. **Set Environment Variables:**
   ```bash
   netlify env:set VITE_API_URL https://edizo-backend.onrender.com/api
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

#### Method B: Via Netlify Dashboard

1. **Create New Site:**
   - Netlify Dashboard → "Add new site" → "Import an existing project"
   - Connect Git provider
   - Select same repository

2. **Configure Build:**
   - **Base directory**: `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin/dist`

3. **Set Environment Variables:**
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://edizo-backend.onrender.com/api`

4. **Deploy:**
   - Click "Deploy site"

### Step 3: Create Admin User

Before logging in, ensure an admin user exists in the database:

```bash
# Run the admin creation script
cd backend
node check_admin_users.js
```

This will create a default admin if none exists:
- **Email**: `admin@edizo.in`
- **Password**: `admin123` (change this!)

### Step 4: Verify Admin Panel

1. Visit `https://edizo-admin.netlify.app`
2. Login with admin credentials
3. Verify dashboard loads
4. Test CRUD operations

---

## 🔐 Security Configuration

### 1. Update CORS Settings

In Render backend environment variables:
```
CORS_ORIGIN=https://edizo-frontend.netlify.app,https://edizo-admin.netlify.app
```

### 2. Secure Admin Access

The admin panel already has role-based access:
- Only users with `admin` or `super_admin` role can login
- Non-admin users see "Admin access required" error

### 3. Create Strong Admin Password

```bash
cd backend
npm run generate-hash
# Enter your secure password
# Use the generated hash in database
```

Or use the interactive script:
```bash
npm run generate-hash:interactive
```

### 4. Update Admin Password in Database

```sql
-- Connect to database
mysql -h YOUR_HOST -u remote_user -p edizo_db

-- Update admin password (replace YOUR_HASH_HERE with generated hash)
UPDATE users 
SET password_hash = 'YOUR_HASH_HERE' 
WHERE email = 'admin@edizo.in';
```

---

## 🔄 Continuous Deployment

### Automatic Deploys on Git Push

Both Render and Netlify support automatic deploys:

1. **Render (Backend):**
   - Connected to GitHub main branch
   - Auto-deploys on every push to `backend/`

2. **Netlify (Frontend & Admin):**
   - Connected to GitHub main branch
   - Auto-deploys on every push to `frontend/` or `admin/`

### Manual Deploy

```bash
# Frontend
cd frontend
npm run build
netlify deploy --prod

# Admin
cd admin
npm run build
netlify deploy --prod

# Backend
cd backend
git add .
git commit -m "Update backend"
git push origin main
```

---

## 🧪 Testing Checklist

### Backend
- [ ] Health endpoint responds: `/health`
- [ ] Public endpoints work: `/api/services`, `/api/internships`
- [ ] Admin login works: `/api/auth/login`
- [ ] Database connection is stable
- [ ] CORS allows frontend/admin domains
- [ ] File uploads work (if configured)

### Frontend
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Services page displays data
- [ ] Internships page displays data
- [ ] API calls succeed (check console)

### Admin Panel
- [ ] Login page loads
- [ ] Admin login works
- [ ] Dashboard displays statistics
- [ ] CRUD operations work for all sections:
  - [ ] Services
  - [ ] Internships
  - [ ] Projects
  - [ ] Team
  - [ ] Events
  - [ ] Testimonials
  - [ ] Certificates
  - [ ] Users

---

## 🐛 Troubleshooting

### Backend Issues

**Service Won't Start:**
- Check Render logs (Dashboard → Logs)
- Verify `package.json` has correct start script
- Ensure all dependencies are listed

**Database Connection Fails:**
- Verify environment variables
- Check database allows external connections
- Ensure SSL is configured if required
- Test connection locally with same credentials

**CORS Errors:**
- Update `CORS_ORIGIN` environment variable
- Include both frontend and admin URLs
- Restart service after changing env vars

**Port Binding Error:**
- Render sets `PORT` automatically
- Use `process.env.PORT` in code
- Listen on `0.0.0.0` not `localhost`

### Frontend/Admin Issues

**Build Fails:**
- Check Netlify build logs
- Run `npm run build` locally to test
- Ensure all dependencies in `package.json`

**Blank Page:**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Ensure backend is running and accessible

**API Calls Fail:**
- Check CORS settings in backend
- Verify backend URL in environment variables
- Test backend endpoints directly

**Login Fails:**
- Verify backend is running
- Check database has user records
- Ensure JWT_SECRET is set correctly

---

## 📊 Monitoring & Maintenance

### Monitor Uptime

Use free monitoring services:
- [UptimeRobot](https://uptimerobot.com) - Check every 5 minutes
- [Pingdom](https://www.pingdom.com) - Free tier available

### Set Up Alerts

1. **Render:**
   - Dashboard → Notifications → Email alerts
   - Get notified of failures

2. **Netlify:**
   - Site Settings → Notifications
   - Email alerts for build failures

### Regular Maintenance

1. **Weekly:**
   - Check logs for errors
   - Monitor database storage
   - Review user registrations

2. **Monthly:**
   - Update dependencies
   - Backup database
   - Review security settings

3. **Quarterly:**
   - Rotate JWT_SECRET
   - Update admin passwords
   - Review CORS settings

---

## 📚 Useful Commands

### Backend
```bash
# View logs
render logs -f

# Open in browser
render open

# Restart service
render services restart edizo-backend

# View service info
render services show edizo-backend
```

### Frontend/Admin
```bash
# View deploy logs
netlify deploy --build

# Open site
netlify open

# View status
netlify status

# Rollback
netlify rollback
```

---

## 🌐 Custom Domains (Optional)

### Backend (Render)

1. Dashboard → Settings → Custom Domain
2. Add domain: `api.edizo.com`
3. Update DNS records as instructed
4. Update environment variables:
   ```
   FRONTEND_URL=https://www.edizo.com
   ADMIN_URL=https://admin.edizo.com
   CORS_ORIGIN=https://www.edizo.com,https://admin.edizo.com
   ```

### Frontend (Netlify)

1. Site Settings → Domain Management
2. Add custom domain: `www.edizo.com`
3. Configure DNS (Netlify DNS recommended)

### Admin (Netlify)

1. Site Settings → Domain Management
2. Add custom domain: `admin.edizo.com`
3. Configure DNS

---

## 💰 Cost Breakdown (Free Tier)

| Service | Plan | Cost | Limitations |
|---------|------|------|-------------|
| Render Backend | Free | $0/mo | 750 hours/month, sleeps after 15min |
| Render Database | Free | $0/mo | 1GB storage |
| Netlify Frontend | Free | $0/mo | 100GB bandwidth/month |
| Netlify Admin | Free | $0/mo | 100GB bandwidth/month |
| **Total** | | **$0/mo** | |

### Upgrade Options

- **Render**: $7/mo per service (no sleep, more resources)
- **Netlify**: $19/mo per site (more bandwidth, features)

---

## 📞 Support & Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)

---

## ✅ Deployment Complete!

After following this guide, you should have:

- ✅ Backend running at: `https://edizo-backend.onrender.com`
- ✅ Frontend running at: `https://edizo-frontend.netlify.app`
- ✅ Admin panel running at: `https://edizo-admin.netlify.app`
- ✅ Database connected and migrated
- ✅ User authentication working
- ✅ Admin authentication working
- ✅ CORS configured correctly
- ✅ Continuous deployment enabled

**Next Steps:**
1. Change default admin password
2. Set up monitoring
3. Configure custom domains (optional)
4. Test all features thoroughly
5. Share with users! 🎉
