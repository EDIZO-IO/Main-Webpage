# Deploy EDIZO Backend to Render

## Prerequisites
- Render account (free tier available)
- Git repository (GitHub or GitLab)
- MySQL database credentials

## Step 1: Prepare Backend for Deployment

### 1.1 Update package.json
Ensure your `package.json` has the correct start script:

```json
{
  "name": "edizo-backend",
  "version": "1.0.0",
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

### 1.2 Create `.render.env` File (Local Testing)
Create `backend/.render.env`:

```env
NODE_ENV=production
PORT=3001
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=edizo_db
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://edizo-admin.netlify.app
CORS_ORIGIN=https://your-frontend-domain.com,https://edizo-admin.netlify.app
```

## Step 2: Deploy to Render

### Option A: Deploy via Render Dashboard

#### 1. Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:

**Basic Settings:**
- **Name**: edizo-backend
- **Region**: Oregon (closest to your users)
- **Branch**: main
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: Free

**Environment Variables:**
Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DB_HOST` | `your-mysql-host.com` |
| `DB_USER` | `your-db-username` |
| `DB_PASSWORD` | `your-db-password` |
| `DB_NAME` | `edizo_db` |
| `JWT_SECRET` | `generate-a-secure-random-string` |
| `FRONTEND_URL` | `https://your-frontend.netlify.app` |
| `ADMIN_URL` | `https://edizo-admin.netlify.app` |

5. Click "Create Web Service"

#### 2. Add Database (Optional - Render MySQL)
1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL" or use external MySQL
3. For external MySQL (recommended for free tier):
   - Use [PlanetScale](https://planetscale.com) or [Railway](https://railway.app)
   - Or use your own MySQL server

#### 3. Configure CORS
In your backend code (`backend/server.js` or `backend/config/cors.js`):

```javascript
import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Option B: Deploy via Render CLI

#### Install Render CLI
```bash
npm install -g @render-cloud/cli
```

#### Login
```bash
render login
```

#### Deploy
```bash
cd backend
render up
```

## Step 3: Update Backend Code for Production

### 3.1 Update server.js
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/internships', internshipsRoutes);
// ... other routes

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
```

### 3.2 Update Database Config
`backend/config/database.js`:

```javascript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edizo_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});

export const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;
```

## Step 4: Test Deployment

### 4.1 Check Health Endpoint
```bash
curl https://edizo-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-02T12:00:00.000Z",
  "environment": "production"
}
```

### 4.2 Test API Endpoints
```bash
# Test services endpoint
curl https://edizo-backend.onrender.com/api/services

# Test internships endpoint
curl https://edizo-backend.onrender.com/api/internships
```

### 4.3 Check Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor for errors

## Step 5: Connect Frontend & Admin

### Update Admin Panel (.env)
```env
VITE_API_URL=https://edizo-backend.onrender.com/api
```

### Update Frontend (.env)
```env
VITE_API_URL=https://edizo-backend.onrender.com/api
```

## Step 6: Database Setup

### Run Migrations
Connect to your MySQL database and run:

```bash
# Using MySQL CLI
mysql -h your-host -u your-user -p edizo_db < backend/database/migrations/001_update_internships_schema.sql
mysql -h your-host -u your-user -p edizo_db < backend/database/migrations/002_update_services_schema.sql
mysql -h your-host -u your-user -p edizo_db < backend/database/migrations/003_remove_image_columns.sql
```

### Or Import via phpMyAdmin/Workbench
1. Open your MySQL management tool
2. Select `edizo_db` database
3. Import each migration file in order

## Troubleshooting

### Service Won't Start
- Check logs in Render dashboard
- Verify `package.json` has correct start script
- Ensure all dependencies are listed

### Database Connection Fails
- Verify environment variables are set correctly
- Check database allows external connections
- Ensure SSL is configured for production

### CORS Errors
- Update `CORS_ORIGIN` environment variable
- Include both frontend and admin URLs
- Restart service after changing env vars

### Port Binding Error
- Render automatically sets `PORT` environment variable
- Use `process.env.PORT` in your code
- Listen on `0.0.0.0` not `localhost`

## Useful Commands

```bash
# View service logs
render logs -f

# Open service in browser
render open

# View service info
render services show edizo-backend

# Restart service
render services restart edizo-backend
```

## Free Tier Limitations

- **Web Services**: 750 hours/month (shared across all services)
- **Database**: 1GB storage, limited connections
- **Auto-sleep**: Services sleep after 15 minutes of inactivity
- **Wake-up time**: ~30 seconds for first request

## Production Tips

1. **Use Custom Domain**: Add a custom domain in Render dashboard
2. **Enable Auto-Deploy**: Connect to GitHub for automatic deploys
3. **Monitor Uptime**: Use UptimeRobot or similar service
4. **Set Up Alerts**: Configure email notifications for failures
5. **Regular Backups**: Backup your database regularly

## Links

- [Render Documentation](https://render.com/docs)
- [Render Pricing](https://render.com/pricing)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
